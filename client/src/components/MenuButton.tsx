import hamburgerMenu from '@src/assets/icons/icons8-hamburger-menu.svg';

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton = ({ onClick }: MenuButtonProps) => {
  return (
    <a className="menu-btn" onClick={onClick}>
      <img src={hamburgerMenu} alt="Toggle sidebar" title="Toggle sidebar" />
    </a>
  );
};

export default MenuButton;
