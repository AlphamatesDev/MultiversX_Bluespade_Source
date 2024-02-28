import { ReactNode } from "react";
import cx from "classnames";
import "./Button.css";

type Props = {
  imgSrc: string;
  children: ReactNode;
  onClick: () => void;
  className?: string;
  mode: string;
};

export default function ConnectWalletButton({ imgSrc, children, onClick, className, mode }: Props) {
  let classNames = cx(mode === 'dark' ? "btn btn-primary btn-sm connect-wallet" : "btn btn-primary btn-sm connect-wallet-light", className);
  return (
    <div className='bordered-btn'>
      <button className={classNames} onClick={onClick}>
        <span className="btn-label">{children}</span>
      </button>
    </div>
  );
}
