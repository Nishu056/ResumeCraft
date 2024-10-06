import React, { useState, useEffect } from 'react';
import './filter.css';
import { FilterTags } from '../utils/skillsData';
import Header from "./Header"

const Filter = () => {
  // Local state for managing the filter value
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState(FilterTags);
  const [selectedTag, setSelectedTag] = useState(null); 

  const handleTagClick = (value) => {
    setSelectedTag(value); // Set the selected tag
  };

  // Effect to filter tags based on the searchTerm
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTags(FilterTags);
    } else {
      setFilteredTags(
        FilterTags.filter(tag => tag.label.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
  }, [searchTerm, FilterTags]);

  return (
  <>
  <Header/>
    <div className='container'>
      <div className="tag">
        {filteredTags.map(item => (
          <div
            key={item.id}
            className={`tags ${selectedTag === item.value ? 'selected' : ''}`}
            onClick={() => handleTagClick(item.value)}
          >
            <p className='display'>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Filter;

