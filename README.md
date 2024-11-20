The answer to the first two questions are given in the simplyfi-assigmnet.pdf file.

To run the project clone the repository

now navigate to the Network folder

```
cd Network
```

for all scripts you need to do the chmod +x function to read write the script so first do that and then all scriptfiles

```
chmod +x registerEnroll.sh
chmod +x startNetwork.sh
chmod +x stopNetwork.sh
```
run the startNetwork.sh script file to automate the initialization and setup of the blockchain network.

```
./stratNetwork.sh
```
**a.Store**
set the environment variables for the university organisation

```
export CHANNEL_NAME=mychannel
export FABRIC_CFG_PATH=./peercfg
export CORE_PEER_LOCALMSPID=universityMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/university.scholar.com/peers/peer0.university.scholar.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/university.scholar.com/users/Admin@university.scholar.com/msp
export CORE_PEER_ADDRESS=localhost:8051
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/scholar.com/orderers/orderer.scholar.com/msp/tlscacerts/tlsca.scholar.com-cert.pem
export scholarshipDepartment_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/scholarshipDepartment.scholar.com/peers/peer0.scholarshipDepartment.scholar.com/tls/ca.crt
export treasury_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/treasury.scholar.com/peers/peer0.treasury.scholar.com/tls/ca.crt
export university_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/university.scholar.com/peers/peer0.university.scholar.com/tls/ca.crt
export auditor_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/auditor.scholar.com/peers/peer0.auditor.scholar.com/tls/ca.crt
```

run the below ivoke function

```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.scholar.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n Scholar --peerAddresses localhost:7051 --tlsRootCertFiles $scholarshipDepartment_PEER_TLSROOTCERT --peerAddresses localhost:9051 --tlsRootCertFiles $treasury_PEER_TLSROOTCERT --peerAddresses localhost:8051 --tlsRootCertFiles $university_PEER_TLSROOTCERT --peerAddresses localhost:11051 --tlsRootCertFiles $auditor_PEER_TLSROOTCERT -c '{"function":"submitStudentList","Args":["clga1","anu","78"]}'
```
**b.Retrive**
run the below query command

```
peer chaincode query -C $CHANNEL_NAME -n Scholar -c '{"function":"queryStudent","Args":["clga1"]}'
```

**c.update**
run the below invoke function

```
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.scholar.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n Scholar --peerAddresses localhost:7051 --tlsRootCertFiles $scholarshipDepartment_PEER_TLSROOTCERT --peerAddresses localhost:9051 --tlsRootCertFiles $treasury_PEER_TLSROOTCERT --peerAddresses localhost:8051 --tlsRootCertFiles $university_PEER_TLSROOTCERT --peerAddresses localhost:11051 --tlsRootCertFiles $auditor_PEER_TLSROOTCERT -c '{"function":"updateStudentDetails","Args":["clga1","newAnu","78"]}'
```

you can check the updated data by once again querying the entry

```
peer chaincode query -C $CHANNEL_NAME -n Scholar -c '{"function":"queryStudent","Args":["clga1"]}'
```

**d.GetHistory**

```
peer chaincode query -C $CHANNEL_NAME -n Scholar -c '{"function":"getHistory","Args":["clga1"]}'
```
**e.GetbyNonPrimaryKey**
```
peer chaincode query -C $CHANNEL_NAME -n Scholar -c '{"function":"queryStudentsByStatus","Args":["Submitted"]}'
```
this command will fetch all the netries which have status as Submitted



