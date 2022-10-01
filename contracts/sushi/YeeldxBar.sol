pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract YeeldxBar is ERC20("YeeldxBar", "xYeeld"){
    using SafeMath for uint256;
    IERC20 public yeeldx;

    constructor(IERC20 _yeeldx) public {
        yeeldx = _yeeldx;
    }

    // Enter the bar. Pay some YEELDXs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalYeeldx = yeeldx.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalYeeldx == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalYeeldx);
            _mint(msg.sender, what);
        }
        yeeldx.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your YEELDXs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(yeeldx.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        yeeldx.transfer(msg.sender, what);
    }
}