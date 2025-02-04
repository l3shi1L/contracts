﻿
# Bancor Protocol Contracts v0.5 (beta)

## Overview

Bancor is a decentralized liquidity protocol that provides tokens with constant liquidity. The protocol is made up of a series of smart contracts which are designed to pool liquidity and perform non-custodial token-to-token conversions in a single transaction. More than 150 tokens are integrated with the Bancor Protocol, including ETH, EOS, DAI, IQ, PEOS & more. 

* Join the [Bancor Developers Telegram group](https://t.me/BancorDevelopers) or the [Bancor Protocol Telegram group](https://t.me/bancor)
* Check out the [Bancor Blog](https://blog.bancor.network/) 
* Read the Bancor Protocol [Whitepaper](https://storage.googleapis.com/website-bancor/2018/04/01ba8253-bancor_protocol_whitepaper_en.pdf)
* Visit the [Bancor Web App](https://www.bancor.network/communities/5a780b3a287443a5cdea2477?utm_source=social&utm_medium=github&utm_content=readme)

## How Bancor Works

Token conversions via the Bancor Protocol are executed against on-chain liquidity pools known as “Bancor Relays”. Each Relay holds reserves of both BNT (Bancor’s Network Token) and a base token (which could be any ERC20 or EOS-based token, with more blockchains to come). For instance, the base token for the ‘DAIBNT’ Relay is DAI.

A Relay’s reserves receive and dispense tokens in order to fulfill trades and are autonomously rebalanced to determine prices. Selling BNT for the base token increases the size of the BNT reserve and decreases the size of the base token’s reserve. This shifts the reserve ratio, increasing the base token's price relative to BNT for subsequent transactions. The larger a trade relative to the total size of the reserves, the more price slippage will occur. 

Since BNT is a common pair for all Relays, it can be used as an intermediary allowing direct token-token trades in a single transaction, including across different blockchains. Notably, traders never need to hold BNT to perform conversions via Bancor Protocol.

## Providing Liquidity on Bancor

Anyone can become a liquidity provider to a Relay and contribute to its reserves. This is different than buying tokens on Bancor. It requires staking tokens in a Relay. Users can stake their tokens in a Relay by buying “Relay Tokens” on bancor.network, or through any third-party liquidity portal built atop the Bancor Protocol. Relay Tokens can be sold at any time to withdraw a proportional share of the Relay’s liquidity.    

Each time a Relay processes a conversion, a small liquidity provider fee (usually 0.1-0.3%) is taken out of each trade and deposited into the Relay’s reserves. These fees function as an incentive for liquidity providers who can withdraw their proportional share of the reserves including the accumulated fees. The larger a Relay’s reserves, the lower the slippage costs incurred by traders transacting with the Relay, driving more conversion volume and, in turn, more fees for liquidity providers. 

Currently, whoever initiates the Relay determines its fees, while in the future, liquidity providers will be able to vote on the Relay’s fee. Bancor takes no platform fee from trades.

## Upgradeability

All smart contract functions are public and all upgrades are opt-in. If significant improvements are made to the system a new version will be released. Token owners can choose between moving to the new system or staying in the old one. If possible, new versions will be backwards compatible and able to trade with the old versions.

## Language

A “Smart Token” refers to tokens which utilize reserves to automate trading, including “Liquid Tokens” (one reserve), “Relay Tokens” (two reserves) and “Array Tokens” (three or more reserves). See Section 6 of the [Bancor Whitepaper](https://storage.googleapis.com/website-bancor/2018/04/01ba8253-bancor_protocol_whitepaper_en.pdf) (“Smart Token Configurations”) for more details.

The terms “reserves” and “connectors” have the same meaning throughout Bancor’s smart contract code and documentation. “Reserve ratio” and “connector weight” are also used interchangeably. “Connector balance” refers to the token inventories held in a Smart Token’s reserve.

## Warning

Bancor is a work in progress. Make sure you understand the risks before using it.

# The Bancor Standards

Bancor protocol is implemented using multiple contracts. The main contracts are SmartToken and BancorConverter.
BancorConverter is responsible for converting between a token and its reserves.
SmartToken represents a converter aware ERC-20 compliant token.

# The Smart Token Standard

## Motivation

Those will allow creating a Bancor compliant token while keeping dependencies at a minimum.
In addition, it allows an owning contract to extend its functionality by giving the owner full control.

## Specification

### SmartToken

First and foremost, a Smart Token is also an ERC-20 compliant token.
As such, it implements both the standard token methods and the standard token events.

### Methods

Note that these methods can only be executed by the token owner.

**issue**
```solidity
function issue(address _to, uint256 _amount)
```
Increases the token supply and sends the new tokens to an account.
<br>
<br>
<br>
**destroy**
```solidity
function destroy(address _from, uint256 _amount)
```
Removes tokens from an account and decreases the token supply.
<br>
<br>
<br>
**disableTransfers**
```solidity
function disableTransfers(bool _disable)
```
Disables transfer/transferFrom functionality.
<br>
<br>
<br>

### Events

**NewSmartToken**
```solidity
event NewSmartToken(address _token)
```
Triggered when a smart token is deployed.
<br>
<br>
<br>
**Issuance**
```solidity
event Issuance(uint256 _amount)
```
Triggered when the total supply is increased.
<br>
<br>
<br>
**Destruction**
```solidity
event Destruction(uint256 _amount)
```
Triggered when the total supply is decreased.
<br>
<br>
<br>

# The Bancor Converter Standard

The following section describes standard functions a bancor converter can implement.

## Motivation

Those will allow dapps and wallets to buy and sell the token.

The most important here is `convert`.

## Specification

### Methods

**reserveTokenCount**
```solidity
function reserveTokenCount() public constant returns (uint16 count)
```
Gets the number of reserve tokens defined for the token.
<br>
<br>
<br>
**reserveTokens**
```solidity
function reserveTokens() public constant returns (address[] reserveTokens)
```
Gets an array of the reserve token contract addresses.
<br>
<br>
<br>
**reserves**
```solidity
function reserves(address _reserveToken) public constant
```
Gets the reserve token details.
<br>
<br>
<br>
**convert**
```solidity
function convert(address _fromToken, address _toToken, uint256 _amount, uint256 _minReturn)
```
converts a specific amount of _fromToken to _toToken
The conversion will only take place if it returns a value greater or equal to `_minReturn`.
<br>
<br>
<br>

### Events

**Conversion**
```solidity
event Conversion(address indexed _fromToken, address indexed _toToken, address indexed _trader, uint256 _amount, uint256 _return, uint256 _currentPriceN, uint256 _currentPriceD);
```
Triggered when a conversion between one of the convertible tokens takes place.

## Testing

### Prerequisites

* node 10.16.0
* npm 6.9.0
* python 3.7.3
* web3.py 4.9.2

### Installation

* `npm install`

### Verification

* Verifying all the contracts:
  * `npm test 1` (quick testing)
  * `npm test 2` (full coverage)
* Verifying the accuracy of the BancorFormula contract:
  * `python ./solidity/python/RandomTestCross.py`
  * `python ./solidity/python/RandomTestPower.py`
  * `python ./solidity/python/RandomTestPurchase.py`
  * `python ./solidity/python/RandomTestSale.py`
  * `python ./solidity/python/RandomTestTradeCPS.py`
  * `python ./solidity/python/RandomTestTradePS.py`
  * `python ./solidity/python/RandomTestTradePSC.py`
  * `python ./solidity/python/RandomTestTradeSP.py`
  * `python ./solidity/python/RandomTestVerifyCross.py`
* Verifying the correctness of the BancorFormula contract:
  * `python ./solidity/python/RunGanache.py`
  * `python ./solidity/python/EmulationExpTestCross.py`
  * `python ./solidity/python/EmulationExpTestPurchase.py`
  * `python ./solidity/python/EmulationExpTestSale.py`
  * `python ./solidity/python/EmulationUniTestCross.py`
  * `python ./solidity/python/EmulationUniTestPurchase.py`
  * `python ./solidity/python/EmulationUniTestSale.py`
* Verifying the performance of the BancorFormula contract:
  * `python ./solidity/python/RunGanache.py`
  * `python ./solidity/python/PerformanceExpTestCross.py`
  * `python ./solidity/python/PerformanceExpTestPurchase.py`
  * `python ./solidity/python/PerformanceExpTestSale.py`
  * `python ./solidity/python/PerformanceUniTestCross.py`
  * `python ./solidity/python/PerformanceUniTestPurchase.py`
  * `python ./solidity/python/PerformanceUniTestSale.py`

### Deploy Network Emulation

```bash
node ./solidity/migrations/deploy_network_emulation.js
    Configuration file name
    Ethereum node address
    Account private key
```

### Migrate Converter Registry

```bash
node ./solidity/migrations/migrate_converter_registry.js
    Ethereum node address
    Account private key
    Old BancorConverterRegistry contract address
    New BancorConverterRegistry contract address
```

### Verify Network Path Finder

```bash
node ./solidity/migrations/verify_network_path_finder.js
    Ethereum node address
    BancorNetworkPathFinder contract address
    BancorConverterRegistry contract addresses
```

#### Deploy Network Emulation / Notes

This process can also be executed via `truffle deploy` or `truffle migrate` provided with the same input parameters:
```bash
truffle deploy
    Configuration file name
    Ethereum node address
    Account private key
```

The configuration file is updated during the process, in order to allow resuming a prematurely-terminated execution.

Here is an example of the initial configuration file which should be provided to the process:
```json
{
    "etherTokenParams": {
        "supply": "13000000000000000"
    },
    "smartToken1Params": {
        "name": "Bancor Network Token",
        "symbol": "BNT",
        "decimals": 18,
        "supply": "68000000000000000000"
    },
    "smartToken2Params": {
        "name": "Smart Token Of Chayot",
        "symbol": "STC",
        "decimals": 18,
        "supply": "1000000000000000000"
    },
    "smartToken3Params": {
            "name": "XXX/BNT Relay Token",
        "symbol": "XXXBNT",
        "decimals": 18,
        "supply": "200000000000000000"
    },
    "smartToken4Params": {
            "name": "YYY/BNT Relay Token",
        "symbol": "YYYBNT",
        "decimals": 18,
        "supply": "8300000000000000000"
    },
    "erc20TokenAParams": {
            "name": "XXX Standard Token",
        "symbol": "XXX",
        "decimals": 18,
        "supply": "1500000000000000000000"
    },
    "erc20TokenBParams": {
            "name": "YYY Standard Token",
        "symbol": "YYY",
        "decimals": 18,
        "supply": "1000000000000000000000"
    },
    "converter1Params": {
        "fee": 0,
        "ratio1": 100000,
        "reserve1": "13000000000000000"
    },
    "converter2Params": {
        "fee": 0,
        "ratio1": 500000,
        "reserve1": "300000000000000000"
    },
    "converter3Params": {
        "fee": 1000,
        "ratio1": 500000,
        "reserve1": "400000000000000000",
        "ratio2": 500000,
        "reserve2": "520000000000000000"
    },
    "converter4Params": {
        "fee": 1000,
        "ratio1": 500000,
        "reserve1": "250000000000000000",
        "ratio2": 500000,
        "reserve2": "1300000000000000000"
    },
    "priceLimitParams": {
        "value": "6000000000"
    }
}
```

## Collaborators

* **[Yudi Levi](https://github.com/yudilevi)**
* **[Barak Manos](https://github.com/barakman)**
* **[Ilana Pinhas](https://github.com/ilanapi)**
* **[David Benchimol](https://github.com/davidbancor)**
* **[Or Dadosh](https://github.com/ordd)**
* **[Martin Holst Swende](https://github.com/holiman)**

## License

Bancor Protocol is open source and distributed under the Apache License v2.0
