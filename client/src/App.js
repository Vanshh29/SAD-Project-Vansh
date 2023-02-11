import Editor from './Editor'
// 114 importing some components for routing
  // using React-router-dom v5 as v6 doesn't supports Switch and Redirect
import {BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
// 121. importing uuid
import { v4 as uuidV4} from 'uuid'

function App() {
  // returning the Editor.js 
  // 115. only thing to use a router is, wrap everything inside a router
  return (
    <Router>
      {/* 116. adding switch statements with each Route as its case */}
      <Switch>
        {/* 117. Route for exactly homepage */}
        <Route path = "/" exact>
        {/* 120. here redirecting to a new document with new uuid */}
        <Redirect to = {`/documents/${uuidV4()}`} />
        {/* useNavigate({`/documents/${uuidV4()}`}) */}
        </Route>
        {/* 118. Route for document with any id */}
        <Route path = "/documents/:id">
          {/* 119. so here we want to render our Editor.js */}
          <Editor/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
