import React, { memo } from 'react';
import classNames from 'classnames';
import { useInstance } from 'react-ioc';
import { DemoUserService } from '../services/demo-user.service';

// export const replaceReact = R => Object.assign(React, R);

export default memo(
  ({ children, className, color, style }: { children: any; className?: string; color?: string; style?: React.CSSProperties }) => {
    const us = useInstance(DemoUserService);
    // const [us] = React.useState(null);
    console.log(us.user);
    return (
      <div className={classNames('panel', className)} style={style}>
        sdfdssdf
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
  }
);
