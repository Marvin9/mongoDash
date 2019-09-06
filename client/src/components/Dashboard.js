import React, { Component } from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Databases from './Databases'
import Collections from './Collections'
import Collection from './Collection'

class Dashboard extends Component {
    constructor() {
        super()
        this.refresh = this.refresh.bind(this)
    }

    refresh() {
        this.forceUpdate()
    }

    render() {
        return (
                    <Router>
                        <div id="dashboard">
                            <button className="button is-primary" onClick={this.refresh}>Refresh</button>
                            <br/>
                            <br />
                            <Route path="/" exact component={() => <Databases />} />
                            <Route path="/:db/collection" exact component={({match}) => {
                                return(
                                    <Collections db={match.params.db}/>
                                )
                                }} />
                            <Route path="/collection/:db/:collection" exact component={({match}) => {
                                return(
                                    <Collection db={match.params.db} collection={match.params.collection}/>
                                )
                                }}/>
                        </div>
                    </Router>
        )
    }
}

export default Dashboard
