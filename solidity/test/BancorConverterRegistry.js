/* global artifacts, contract, it, assert */
/* eslint-disable prefer-reflect */

const BancorConverterRegistry = artifacts.require('BancorConverterRegistry');
const utils = require('./helpers/Utils');

contract('BancorConverterRegistry', accounts => {
    it('verifies that the registry is reset after construction', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        let count = await converterRegistry.tokenCount.call();
        assert.equal(count, 0);
    });

    it('verifies that the owner can register a converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let tokenAddress = await converterRegistry.tokenAddress.call(accounts[2]);
        assert.equal(tokenAddress, accounts[1]);
    });

    it('should throw when a non owner attempts to register a converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();

        await utils.catchRevert(converterRegistry.registerConverter(accounts[1], accounts[2], { from: accounts[3] }));
    });

    it('should throw when attempting to register an invalid token address', async () => {
        let converterRegistry = await BancorConverterRegistry.new();

        await utils.catchRevert(converterRegistry.registerConverter(utils.zeroAddress, accounts[2]));
    });

    it('should throw when attempting to register an invalid converter address', async () => {
        let converterRegistry = await BancorConverterRegistry.new();

        await utils.catchRevert(converterRegistry.registerConverter(accounts[1], utils.zeroAddress));
    });

    it('should throw when attempting to register a converter that already exists', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);

        await utils.catchRevert(converterRegistry.registerConverter(accounts[1], accounts[2]));
    });

    it('verifies that the token count is increased when registering the first converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        let prevCount = await converterRegistry.tokenCount.call();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let newCount = await converterRegistry.tokenCount.call();
        assert.equal(prevCount.toNumber() + 1, newCount.toNumber());
    });

    it('verifies that the token count is not increased when registering another converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let prevCount = await converterRegistry.tokenCount.call();
        await converterRegistry.registerConverter(accounts[1], accounts[3]);
        let newCount = await converterRegistry.tokenCount.call();
        assert.equal(prevCount.toNumber(), newCount.toNumber());
    });

    it('verifies that the token count is increased when registering converters for 2 different tokens', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        let prevCount = await converterRegistry.tokenCount.call();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        await converterRegistry.registerConverter(accounts[3], accounts[4]);
        let newCount = await converterRegistry.tokenCount.call();
        assert.equal(prevCount.toNumber() + 2, newCount.toNumber());
    });

    it('verifies that the converter count is increased when registering a converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        let prevCount = await converterRegistry.converterCount.call(accounts[1]);
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let newCount = await converterRegistry.converterCount.call(accounts[1]);
        assert.equal(prevCount.toNumber() + 1, newCount.toNumber());
    });

    it('verifies that the converter count is increased when registering another converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        let prevCount = await converterRegistry.converterCount.call(accounts[1]);
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        await converterRegistry.registerConverter(accounts[1], accounts[3]);
        let newCount = await converterRegistry.converterCount.call(accounts[1]);
        assert.equal(prevCount.toNumber() + 2, newCount.toNumber());
    });

    it('verifies that the correct converter addresses are returned when registering 2 converters for the same token', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        let converter0 = await converterRegistry.converterAddress.call(accounts[1], 0);
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let converter1 = await converterRegistry.converterAddress.call(accounts[1], 0);
        await converterRegistry.registerConverter(accounts[1], accounts[3]);
        let converter2 = await converterRegistry.converterAddress.call(accounts[1], 1);
        assert.equal(converter0, utils.zeroAddress);
        assert.equal(converter1, accounts[2]);
        assert.equal(converter2, accounts[3]);
    });

    it('verifies that the correct latest converter addresses are returned when registering 2 converters for the same token', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        let converter0 = await converterRegistry.latestConverterAddress.call(accounts[1]);
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let converter1 = await converterRegistry.latestConverterAddress.call(accounts[1]);
        await converterRegistry.registerConverter(accounts[1], accounts[3]);
        let converter2 = await converterRegistry.latestConverterAddress.call(accounts[1]);
        assert.equal(converter0, utils.zeroAddress);
        assert.equal(converter1, accounts[2]);
        assert.equal(converter2, accounts[3]);
    });

    it('verifies that the correct token address is returned when registering 2 converters for the same token', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let token1 = await converterRegistry.tokenAddress.call(accounts[2]);
        await converterRegistry.registerConverter(accounts[1], accounts[3]);
        let token2 = await converterRegistry.tokenAddress.call(accounts[3]);
        assert.equal(token1, accounts[1]);
        assert.equal(token2, accounts[1]);
    });

    it('verifies that the owner can unregister a converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        await converterRegistry.unregisterConverter(accounts[1], 0);
        let tokenAddress = await converterRegistry.tokenAddress.call(accounts[2]);
        assert.equal(tokenAddress, utils.zeroAddress);
    });

    it('should throw when a non owner attempts to unregister a converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);

        await utils.catchRevert(converterRegistry.unregisterConverter(accounts[1], 0, { from: accounts[3] }));
    });

    it('should throw when attempting to unregister with an invalid token address', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);

        await utils.catchRevert(converterRegistry.unregisterConverter(utils.zeroAddress, 0));
    });

    it('should throw when attempting to unregister with an invalid converter index', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);

        await utils.catchRevert(converterRegistry.unregisterConverter(accounts[1], 1));
    });

    it('verifies that a converter is not registered after unregistering a converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        await converterRegistry.unregisterConverter(accounts[1], 0);
        let tokenAddress = await converterRegistry.tokenAddress.call(accounts[2]);
        assert.equal(tokenAddress, utils.zeroAddress);
    });

    it('verifies that the converter count is decreased after unregistering a converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let prevCount = await converterRegistry.converterCount.call(accounts[1]);
        await converterRegistry.unregisterConverter(accounts[1], 0);
        let newCount = await converterRegistry.converterCount.call(accounts[1]);
        assert.equal(prevCount.toNumber() - 1, newCount.toNumber());
    });

    it('verifies that the token count is not decreased after unregistering one of several converters', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        await converterRegistry.registerConverter(accounts[1], accounts[3]);
        let prevCount = await converterRegistry.tokenCount.call();
        await converterRegistry.unregisterConverter(accounts[1], 0);
        let newCount = await converterRegistry.tokenCount.call();
        assert.equal(prevCount.toNumber(), newCount.toNumber());
    });

    it('verifies that the token count is decreased after unregistering the only remaining converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        let prevCount = await converterRegistry.tokenCount.call();
        await converterRegistry.unregisterConverter(accounts[1], 0);
        let newCount = await converterRegistry.tokenCount.call();
        assert.equal(prevCount.toNumber() - 1, newCount.toNumber());
    });

    it('verifies that the correct converter is returned after deleting an older converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        await converterRegistry.registerConverter(accounts[1], accounts[3]);
        await converterRegistry.unregisterConverter(accounts[1], 0);
        let converter = await converterRegistry.converterAddress.call(accounts[1], 0);
        assert.equal(converter, accounts[3]);
    });

    it('verifies that the correct latest converter is returned after deleting an older converter', async () => {
        let converterRegistry = await BancorConverterRegistry.new();
        await converterRegistry.registerConverter(accounts[1], accounts[2]);
        await converterRegistry.registerConverter(accounts[1], accounts[3]);
        await converterRegistry.unregisterConverter(accounts[1], 0);
        let converter = await converterRegistry.latestConverterAddress.call(accounts[1]);
        assert.equal(converter, accounts[3]);
    });

    it('delete first token until all tokens deleted', async function() {
        let converterRegistry = await BancorConverterRegistry.new();
        await deleteAllOneByOne(converterRegistry, +1);
    });

    it('delete last token until all tokens deleted', async function() {
        let converterRegistry = await BancorConverterRegistry.new();
        await deleteAllOneByOne(converterRegistry, -1);
    });

    async function deleteAllOneByOne(converterRegistry, direction) {
        console.log(`adding ${accounts.length} tokens...`);
        for (const account of accounts)
            await converterRegistry.registerConverter(account, account);
        for (let tokens = accounts.slice(); tokens.length > 0; tokens.length--) {
            const bgnIndex = (tokens.length - 1) * (1 - direction) / 2;
            const endIndex = (tokens.length - 1) * (1 + direction) / 2;
            const token = await converterRegistry.tokens(bgnIndex);
            await converterRegistry.unregisterConverter(token, 0);
            assert.equal(token, tokens[bgnIndex]);
            tokens[bgnIndex] = tokens[endIndex];
            console.log(`token ${bgnIndex} deleted`);
        }
    };
});