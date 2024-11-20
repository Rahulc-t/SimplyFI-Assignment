**1\. Steps for installing and instantiating the Chain code on HLF2.2**

1.Download the script file install-fabric.sh from the hyperledger fabric github repository.  
Use the chmod \+x to make it executable

curl \-sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod \+x install-fabric.sh

2.install hyperledger fabric version 2.2.2 and fabric-CA version1.4.9

	./install-fabric.sh \-f '2.2.2' \-c '1.4.9'  
This will install all the binaries,docker images,configuration and add all the files in the fabric-samples repository

3.There will be a fabric samples folder which contains all the needed files for this sample network, navigate to the directory which contains the sample test network setup file

cd fabric-samples/test-network/

4.start the network and create a channel for communication between organizations using the cryptogen tool  
	./network.sh up createChannel

5.deploy the chaincode basic to the channel specifying its language and path

./network.sh deployCC \-ccn basic \-ccp ../asset-transfer-basic/chaincode-javascript \-ccl javascript

6.setup the environment variables for specifying paths and configurations

export PATH=${PWD}/../bin:$PATH  
Instructs the computer where to find the fabric tools by adding their locations to the system’s PATH  
export FABRIC\_CFG\_PATH=$PWD/../config/  
Specifies the location of the config files  
export CORE\_PEER\_TLS\_ENABLED=true  
Turns on TLS ensuring that communication between network component is encrypted  
export CORE\_PEER\_LOCALMSPID="Org1MSP"  
Specify the identity of the organisation your are acting as  
export CORE\_PEER\_TLS\_ROOTCERT\_FILE=${PWD}/organizations/peerOrganizations/[org1.example.com/peers/peer0.org1.example.com/tls/ca.crt](http://org1.example.com/peers/peer0.org1.example.com/tls/ca.crt)  
Points to the file containing org1 TLS certificate  
export CORE\_PEER\_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/[org1.example.com/users/Admin@org1.example.com/msp](http://org1.example.com/users/Admin@org1.example.com/msp)  
Specify admin credentials to act as the administrator of org1

export CORE\_PEER\_ADDRESS=localhost:7051  
Specifies the address of org1’s peer

7.run the InitLedger function to initialize the ledger,it also adds assets to the chain 

peer chaincode invoke \-o localhost:7050 \--ordererTLSHostnameOverride orderer.example.com \--tls \--cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \-C mychannel \-n basic \--peerAddresses localhost:7051 \--tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \--peerAddresses localhost:9051 \--tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \-c '{"function":"InitLedger","Args":\[\]}'

8.use the getAllAssets function to retrieve all the functions

	peer chaincode query \-C mychannel \-n basic \-c '{"Args":\["GetAllAssets"\]}'

9.stop the network

./network.sh down

**2.Explain Cryptogen and Configtxgen**

**Cryptogen**

Cryptogen is a command line tool which is provided by  hyperledger fabric to generate cryptographic materials required to set up a Hyperleger fabric network.   
These cryptographic materials include private keys,certificates and MSPs. This simplifies the process of creating necessary identities to the network participants such as organizations,peers and orderers.  
cryptogen relies on crypto-config.yaml to specify details like the number of peers, orderers, organizations,users,etc  
The tool is run using the cryptogen generate command to create certificates and keys which is then used to configure the network and establish secure communication.

**Configtxgen**

Configtxgen or configuration transaction generator is a tool provided by hyperledger fabric for creating configuration artifacts which is required for setting up and managing the blockchain network.  
These artifacts define the structure, policies, and behavior of the network.  
The channel profiles required for the tool is defined in the configtx.yaml file  
We use configtxgen tool to create the genesis block, given below is a sample command used to create this genesis block,

configtxgen \-profile ChannelUsingRaft \-outputBlock ./channel\-artifacts/channel1.block \-channelID channel1

The \-profile flag is used to reference the ChannelUsingRaft profile from configtx.yaml file

The output of this command is the channel genesis block that is written to \-output ./channel-artifacts/channel1.block

Its also has other functions such as creating channel configuration transactions and anchor peer updation.

 

