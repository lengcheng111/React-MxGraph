import React, { useEffect, useState } from 'react';
import './SvgAwsIcons.css';
import resource from './resource.json';

// TODO: should generate list sprite icon for aws, azue, gpc

const SvgAwsIcons = props => {
    const [icons, setIcons] = useState([]);

    const recursiveGetIcons = (obj, searchKey, results = []) => {
        const r = results;
        Object.keys(obj).forEach(key => {
           const value = obj[key];
           if(key === searchKey && typeof value !== 'object'){
              r.push(value);
           }else if(typeof value === 'object'){
              recursiveGetIcons(value, searchKey, r);
           }
        });
        return r;
     };
    
    const createSvgRoot = () => {
        return document.createElementNS('http://www.w3.org/2000/svg', 'svg'); 
    }
     
    const build = () => {
        const icons = recursiveGetIcons(resource, 'icon');
        const svgRoot = createSvgRoot();

        icons.map(icon => {

        });

    }

    // useEffect(() => {
    //     setIcons(recursiveGetIcons(resource, 'icon'));
    // });

    return (
        <>
            <svg id="svg-icon-sprite">
                <symbol viewBox="0 0 50 50" id="AWS--Compute--_Instance--Amazon-EC2_A1-Instance_light-bg" xmlns="http://www.w3.org/2000/svg">
                    <g id="ahaWorking">
                        <path className="ahacls-152699482124763654285" d="m23 30.09-.75-2.43h-3.63l-.72 2.43h-2.42l3.75-10.65h2.54l3.74 10.65zM19.11 26h2.67l-1.35-4.45zm10.66 4.09v-8.4l-2.77.86V20.8l3-1.36h2v10.65z"></path><path className="ahacls-152699482124763654285" d="M44.31 44.31H5.69V5.69h38.62zm-36.62-2h34.62V7.69H7.69z"></path>
                        <path className="ahacls-152699482124763654285" d="M11.21 1h2v5.69h-2zm6.27 0h2v5.69h-2zm6.28 0h2v5.69h-2zm6.28 0h2v5.69h-2zm6.28 0h2v5.69h-2zM11.21 43.31h2V49h-2zm6.27 0h2V49h-2zm6.28 0h2V49h-2zm6.28 0h2V49h-2zm6.28 0h2V49h-2zm6.99-31.86H49v2h-5.69zm0 6.27H49v2h-5.69zm0 6.28H49v2h-5.69zm0 6.28H49v2h-5.69zm0 6.27H49v2h-5.69zM1 11.45h5.69v2H1zm0 6.27h5.69v2H1zM1 24h5.69v2H1zm0 6.28h5.69v2H1zm0 6.27h5.69v2H1z"></path>
                    </g>
                </symbol>
            </svg>
        </>
    );
};

export default SvgAwsIcons;