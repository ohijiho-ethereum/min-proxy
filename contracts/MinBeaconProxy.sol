// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library MinBeaconProxy {
    function getCode(address beacon) internal pure returns (bytes memory) {
        /*
        constructor:

|           0x00000000      6045            push1 len               len
|           0x00000002      80              dup1                    len len
|           0x00000003      6009            push1 ost               ost len len
|           0x00000005      3d              returndatasize          0 ost len len
|           0x00000006      39              codecopy                len
|           0x00000007      3d              returndatasize          0 len
\           0x00000008      f3              return

        deployed:

|           0x00000000      635c60da1b      push4 0x5c60da1b        0x5c60da1b
|           0x00000005      3d              returndatasize          0 0x5c60da1b
|           0x00000006      52              mstore
|           0x00000007      3d              returndatasize          0
|           0x00000008      3d              returndatasize          0 0
|           0x00000009      3d              returndatasize          0 0 0
|           0x0000000a      36              calldatasize            cds 0 0 0
|           0x0000000b      3d              returndatasize          0 cds 0 0 0
|           0x0000000c      3d              returndatasize          0 0 cds 0 0 0
|           0x0000000d      36              calldatasize            cds 0 0 cds 0 0 0
|           0x0000000e      3d              returndatasize          0 cds 0 0 cds 0 0 0
|           0x0000000f      3d              returndatasize          0 0 cds 0 0 cds 0 0 0
|           0x00000010      6020            push1 0x20              0x20 0 0 cds 0 0 cds 0 0 0
|           0x00000012      3d              returndatasize          0 0x20 0 0 cds 0 0 cds 0 0 0
|           0x00000013      6004            push1 0x04              4 0 0x20 0 0 cds 0 0 cds 0 0 0
|           0x00000015      601c            push1 0x1c              0x1c 4 0 0x20 0 0 cds 0 0 cds 0 0 0
|           0x00000017      73bebebebebe.   push20 beacon           beacon 0x1c 4 0 0x20 0 0 cds 0 0 cds 0 0 0
|           0x0000002c      5a              gas                     gas beacon 0x1c 4 0 0x20 0 0 cds 0 0 cds 0 0 0
|           0x0000002d      fa              staticcall              suc 0 0 cds 0 0 cds 0 0 0
|           0x0000002e      6032            push1 BEACON_OK         BEACON_OK suc 0 0 cds 0 0 cds 0 0 0
|       ,=< 0x00000030      57              jumpi                   0 0 cds 0 0 cds 0 0 0
|       |   0x00000031      fd              revert
|       `-> 0x00000032      5b              BEACON_OK: jumpdest     0 0 cds 0 0 cds 0 0 0
|           0x00000033      51              mload                   impl 0 cds 0 0 cds 0 0 0
|           0x00000034      92              swap3                   0 0 cds impl 0 cds 0 0 0
|           0x00000035      37              calldatacopy            impl 0 cds 0 0 0
|           0x00000036      5a              gas                     gas impl 0 cds 0 0 0
|           0x00000037      f4              delegatecall            suc 0
|           0x00000038      3d              returndatasize          rds suc 0
|           0x00000039      82              dup3                    0 rds suc 0
|           0x0000003a      80              dup1                    0 0 rds suc 0
|           0x0000003b      3e              returndatacopy          suc 0
|           0x0000003c      90              swap1                   0 suc
|           0x0000003d      3d              returndatasize          rds 0 suc
|           0x0000003e      91              swap2                   suc 0 rds
|           0x0000003f      6043            push1 RETURN            CALL_OK suc 0 rds
|       ,=< 0x00000041      57              jumpi                   0 rds
|       |   0x00000042      fd              revert
|       `-> 0x00000043      5b              CALL_OK: jumpdest       0 rds
\           0x00000044      f3              return
*/
        return
            abi.encodePacked(
                hex"60468060093d393df3"
                hex"635c60da1b3d523d3d3d363d3d363d3d60203d6004601c73",
                beacon,
                hex"5afa603257fd5b5192375af43d82803e903d91604357fd5bf3"
            );
    }
}
