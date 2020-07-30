import React from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';

import css from './TabSwitcher.module.css';

const buttonClass = (i, array, isChecked) => {
    const className = [css.btn];

    if (array.length < 2) className.push(css.noCursor);
    if (isChecked) className.push(css.checked);

    const isFirst = i === 0;
    if (isFirst) className.push(css.firstBtn);

    const isLast = !array[i + 1];
    if (isLast) className.push(css.lastBtn);

    return className.join(' ');
};

const switcher = (tabs, activeTab, setActiveTab) => {
    const buttonsGroup = tabs
        .filter(tab => (tab.label ? true : false))
        .map((tab, i, array) => {
            const isChecked = activeTab.label === tab.label;

            return (
                <ToggleButton
                    key={'radiotab' + i}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={i}
                    checked={isChecked}
                    onChange={e => setActiveTab(tabs[e.currentTarget.value])}
                    className={buttonClass(i, array, isChecked)}
                >
                    {tab.icon ? tab.icon : tab.label}
                </ToggleButton>
            );
        });
    return <div className={css.buttonsGroup}>{buttonsGroup}</div>;
};

const TabSwitcher = ({ tabs, activeTab, setActiveTab }) => switcher(tabs, activeTab, setActiveTab);

export default React.memo(TabSwitcher);
