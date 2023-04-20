// SPDX-License-Identifier: MIT
// Especifica la licencia bajo la cual se distribuye el código fuente. En este caso, la licencia MIT.
pragma solidity ^0.8.9;
// Indica la versión del compilador de Solidity que se utilizará.

import "@openzeppelin/contracts@4.8.3/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts@4.8.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.3/security/Pausable.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC1155/extensions/ERC1155Supply.sol";
// Importa las librerías y contratos necesarios desde OpenZeppelin, no se preocupen si dan error, es por que el deployment lo hacemos desde una ide online.

contract MyToken is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
    // Declara el contrato inteligente "MyToken" que hereda de los contratos ERC1155, Ownable, Pausable, ERC1155Burnable, y ERC1155Supply.

    constructor() ERC1155("") {}
    // Constructor de "MyToken". Inicializa el contrato inteligente ERC1155 con una cadena de URI vacía.

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
    // Permite al propietario del contrato inteligente cambiar la cadena de URI.

    function pause() public onlyOwner {
        _pause();
    }
    // Permite al propietario del contrato inteligente pausar las transferencias de tokens.

    function unpause() public onlyOwner {
        _unpause();
    }
    // Permite al propietario del contrato inteligente reanudar las transferencias de tokens.

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }
    // Permite al propietario del contrato inteligente crear nuevos tokens y asignarlos a una dirección de cuenta específica.

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
    // Permite al propietario del contrato inteligente crear varios tokens al mismo tiempo y asignarlos a una dirección de cuenta específica.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
    // Función interna que se llama antes de cada transferencia de tokens. Verifica que las transferencias estén permitidas y actualiza los balances de las cuentas involucradas. Esta función se sobrescribe de los contratos ERC1155 y ERC1155Supply.
}
