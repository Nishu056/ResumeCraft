import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './Filter';
import './homeContainer.css';
import TemplateDesign from './TemplateDesign';

// RenderATemplate component
const RenderATemplate = ({ templates }) => {
  if (!templates || templates.length === 0) {
    return <p>No Data available</p>;
  }
  return templates.map((template, index) => (
    <TemplateDesign
      key={template._id}
      data={template}
      index={index}
    />
  ));
};

const HomeContainer = () => {
  const [templates, setTemplates] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchTemplates = async () => {
    try {
      setIsError(false);
      console.log('Fetching templates...');
      const response = await axios.get('http://localhost:3000/templates');
      console.log('Response received:', response.data);
      setTemplates(response.data);
    } catch (error) {
      setIsError(true);
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
      console.log('Fetching completed.');
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div>
      <Filter />
      <div className="page">
        {isError ? (
          <p>Something went wrong while fetching the templates. Please try again later.</p>
        ) : isLoading ? (
          <p>Loading templates...</p>
        ) : (
          <div className="show">
            <RenderATemplate templates={templates} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeContainer;
