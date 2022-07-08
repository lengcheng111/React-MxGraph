import React from 'react';
import { memo } from 'react';

const Panel = () => {
    return (
        <div style={{zIndex:1000000000}}>
            show react component
        </div>
    );
};

export default memo(Panel);