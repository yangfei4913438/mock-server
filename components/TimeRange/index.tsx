import { ChangeEvent, useState } from 'react';
import dayjs from 'dayjs';
import cx from 'classnames';

const TimeRange = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [showTime, setShowTime] = useState(true);

  // 格式化时间
  const formatTime = (time: string, date: boolean = false) => {
    let fmt = 'YYYY-MM-DD HH:mm:ss';
    if (date) {
      fmt = 'YYYY-MM-DD';
    }
    return dayjs(time).format(fmt);
  };

  const handleQuery = () => {
    const stime = start ? formatTime(start, !showTime) : '';
    const etime = end ? formatTime(end, !showTime) : '';
    console.log('stime:', stime);
    console.log('etime:', etime);
  };

  const handleShowTime = (e: ChangeEvent<HTMLInputElement>) => {
    const isShow = e.target.checked;
    setShowTime(() => isShow);
    if (isShow) {
      setStart((prev) => (prev ? `${prev}T00:00:00` : ''));
      setEnd((prev) => (prev ? `${prev}T00:00:00` : ''));
    } else {
      setStart((prev) => (prev ? prev.split('T')[0] : ''));
      setEnd((prev) => (prev ? prev.split('T')[0] : ''));
    }
  };

  return (
    <div className="space-y-3">
      <label className="font-bold text-xl">时间范围筛选</label>
      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="label cursor-pointer max-w-max space-x-2">
          <span className="label-text text-lg font-bold">时分秒</span>
          <input
            type="checkbox"
            className="!toggle !toggle-primary checked:bg-none"
            checked={showTime}
            onChange={handleShowTime}
          />
        </label>

        <label className="input-group">
          <span>开始</span>
          <input
            type={showTime ? 'datetime-local' : 'date'}
            step={1}
            value={start}
            placeholder="请输入匹配关键字"
            className="input input-bordered"
            onChange={(e) => {
              setStart(e.target.value);
            }}
          />
        </label>
        <label className="input-group mt-2">
          <span>结束</span>
          <input
            type={showTime ? 'datetime-local' : 'date'}
            step={1}
            value={end}
            placeholder="请输入匹配关键字"
            className="input input-bordered"
            onChange={(e) => {
              setEnd(e.target.value);
            }}
          />
        </label>
        <button
          className={cx('btn btn-sm w-32 h-10 mt-4')}
          // disabled={!start || !end}
          onClick={handleQuery}
        >
          筛选
        </button>
      </div>
    </div>
  );
};

export default TimeRange;
