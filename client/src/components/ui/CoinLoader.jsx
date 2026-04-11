import { useApp } from '../../context/AppContext';

export default function CoinLoader() {
  const { coinLoader } = useApp();

  return (
    <div className={`coin-loader-overlay${coinLoader ? ' active' : ''}`} id="coin-loader">
      <div className="spinning-coin">₱</div>
      <div className="coin-loader-text">{coinLoader}</div>
    </div>
  );
}
