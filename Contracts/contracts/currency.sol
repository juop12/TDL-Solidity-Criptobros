// SPDX-License-Identifier: MIT
// Especifica la licencia bajo la cual se distribuye el código fuente. En este caso, la licencia MIT.
pragma solidity ^0.8.9;
// Indica la versión del compilador de Solidity que se utilizará.

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyCurrency is ERC1155 {

    constructor() ERC1155("") {}
    // Constructor de "MyCurrency". Inicializa el contrato inteligente ERC1155 con una cadena de URI vacía.


    uint256 public constant CURRENCY = 0;

    function faucet(address account, uint quantity)
        public
    {
        _mint(account, CURRENCY, quantity, "QmW2cgHNixSzx7SjobM4BDUKNSMZuLb7g7VJ58osxthmoa"); //faucet
    }
}