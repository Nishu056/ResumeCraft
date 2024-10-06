import React from 'react';
import { skills } from '../utils/skillsData';  
import { Line } from 'rc-progress';
import './skills.css';

const getColor = (category) => {
  switch (category) {
    case 'frontend':
      return 'blue';
    case 'backend':
      return 'green';
    case 'database':
      return 'purple';
    default:
      return 'gray';  
  }
};

const Skills = () => {
  return (
    <div className="skills main ">
      {
        skills.map((item, i) => (
          <div key={i} className='inner-content'>
            <h3 className='category-text'>{item.label}</h3>
            <div className="skills-list">
              {
                item.data.map((skillItem, j) => (
                  <div className="progressbar" key={j}>
                    <p>{skillItem.name}</p>
                    <Line 
                      percent={skillItem.percentage}
                      strokeWidth='2'
                      strokeColor={getColor(item.category)}
                      trailWidth={"2"}
                      strokeLinecap='square'
                    />
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default Skills;
