import React from 'react';
import axios from 'axios';

export default class DataHandler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: ""
        };
    }

    componentDidMount() {
        //axios.post(`http://snowsoft.cz/clickhit/write.php?`, {firstName: 'Fred',lastName: 'Flintstone'})
        axios({
            method: 'post',
            url: 'http://snowsoft.cz/clickhit/write.php?akce=getUsername',
            data: {
                user: 'Fred'
            },
            responseType: 'json' //text, json
        })
                .then(
                        res => {
                            console.log(res.data);
                            this.setState({'data': res.data});
                        }

                )
    }

    isNameAvailable(name) {
        axios.post(`http://snowsoft.cz/clickhit/write.php?akce=getUsername`, {'user': name})
                .then(
                        res => {
                            console.log(res.data);
                            this.setState({'data': res.data});
                        }

                )
    }
    insertScore(data, callback){
        console.log("zapis score na servere");
        axios.post(`http://snowsoft.cz/clickhit/write.php?akce=insertScore`, 
            {
                'nick': data.nick,
                'score': data.score,
                'avgTime': data.avgTime,
                'input': data.input,
                
                
            }
                    )
                .then(
                        res => {
                            console.log(res.data);
                            //this.setState({'data': res.data});
                            callback;
                        }
                              

                )
    }
    loadScore(group){
        console.log("zapis score na servere");
        axios.post(`http://snowsoft.cz/clickhit/write.php?akce=loadScore`, 
            {
                'group': group
            }
                    )
                .then(
                        res => {
                            console.log(res.data);
                            //this.setState({'data': res.data});
                            //callback;
                            this.props.app.loadResults(res.data);
                        }
                              

                )
    }

    render() {
        return (
                <div>
                    
                </div>
                );
    }
}
