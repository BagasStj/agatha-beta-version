import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const DateTimePicker = React.forwardRef((props: any, ref) => {
  return <DatePicker {...props} showTimeSelect dateFormat="Pp" />;
});

DateTimePicker.displayName = 'DateTimePicker';