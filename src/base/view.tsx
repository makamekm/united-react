import React, { memo } from 'react';
import classNames from 'classnames';

export const View: React.FC = memo(({
  children,
  className,
  color,
  style
}: {
  children?: any;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div className={classNames('panel', className)} style={style}>
      Test
      {children}

      <style jsx>{`
        .panel {
          padding: 20px;
          background-color: ${color || 'tomato'};
          color: white;
          font-weight: 800;
          border-radius: 5px;
          text-shadow: 2px 4px 0px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
});
