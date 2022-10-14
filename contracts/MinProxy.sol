// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library MinProxy {
    function getCode(address impl) internal pure returns (bytes memory) {
        /*
        constructor:

|           0x00000000      602d            push1 len               len
|           0x00000002      80              dup1                    len len
|           0x00000003      6009            push1 ost               ost len len
|           0x00000005      3d              returndatasize          0 ost len len
|           0x00000006      39              codecopy                len
|           0x00000007      3d              returndatasize          0 len
\           0x00000008      f3              return

        deployed:
https://eips.ethereum.org/EIPS/eip-1167
|           0x00000000      36              calldatasize            cds
|           0x00000001      3d              returndatasize          0 cds
|           0x00000002      3d              returndatasize          0 0 cds
|           0x00000003      37              calldatacopy
|           0x00000004      3d              returndatasize          0
|           0x00000005      3d              returndatasize          0 0
|           0x00000006      3d              returndatasize          0 0 0
|           0x00000007      36              calldatasize            cds 0 0 0
|           0x00000008      3d              returndatasize          0 cds 0 0 0
|           0x00000009      73bebebebebe.   push20 0xbebebebe       0xbebe 0 cds 0 0 0
|           0x0000001e      5a              gas                     gas 0xbebe 0 cds 0 0 0
|           0x0000001f      f4              delegatecall            suc 0
|           0x00000020      3d              returndatasize          rds suc 0
|           0x00000021      82              dup3                    0 rds suc 0
|           0x00000022      80              dup1                    0 0 rds suc 0
|           0x00000023      3e              returndatacopy          suc 0
|           0x00000024      90              swap1                   0 suc
|           0x00000025      3d              returndatasize          rds 0 suc
|           0x00000026      91              swap2                   suc 0 rds
|           0x00000027      602b            push1 0x2b              0x2b suc 0 rds
|       ,=< 0x00000029      57              jumpi                   0 rds
|       |   0x0000002a      fd              revert
|       `-> 0x0000002b      5b              jumpdest                0 rds
\           0x0000002c      f3              return
*/
        return
            abi.encodePacked(
                hex"602d8060093d393df3"
                hex"363d3d373d3d3d363d73",
                impl,
                hex"5af43d82803e903d91602b57fd5bf3"
            );
    }
}
