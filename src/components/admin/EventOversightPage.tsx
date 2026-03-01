import React from 'react';
import CreateEventPage from '../organizer/CreateEventPage';

const EventOversightPage: React.FC = () => {
  return (
    // The Admin can now use the same page as an organizer to create events
    <CreateEventPage />
  );
};

export default EventOversightPage;
