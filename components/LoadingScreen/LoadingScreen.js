import { Spin } from 'antd';

export default function LoadingScreen() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img
        src="/vndirect.svg"
        alt="VNDIRECT - Wisdom to success"
        className="w-32 h-auto mb-2"
      />
      <Spin />
    </div>
  );
}
