import React from 'react';
import {fetch} from 'fetch';

export class UserProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      user: []
    };
  }
  // componentDidMount lifecycle method allows dynamic behaviour, AJAX, 
  // side effects, etc. We issue our API call here and set the 
  //  response to component's state.
  componentDidMount() {
    gitHubApi('andela-rekemezie').then(data => {
      this.setState({
        user: data
      });
    });
  }

  // Here, we destructure component's state and  render the user details.
  render() {
    const { user } = this.state;
    return (
            <div>
      <h1> data</h1>
      {JSON.stringify(user)}
    </div>
    );
  }
}

// Function that calls our specified endpoint on Github 
// We're using **fetch** method from **fetch API** to make the call.
const gitHubApi = (username) => {
  return fetch(`http://snowsoft.cz/clickhit/data.json`)
    .then(response => {
      return response.json();
    })
    .then(({ login, avatar_url, html_url }) => ({ login, avatar_url, html_url }))
    .catch(error => {
      throw error;
    });
};