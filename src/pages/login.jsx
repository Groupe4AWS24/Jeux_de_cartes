import react from 'react'
import './style.css'

function Login() {

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    
  }


  return (
    <div className="container">
      <h2 className="text-center">Sign up</h2>
      <br />
        <form className="signupForm" action="/dashboard.html" method="post"> {/* Assurez-vous que la méthode et l'action sont correctes */}
          <div className="input-group">
            <label htmlFor="email" className="label">Email</label>
            <input type="email" id="email" className="input" />
            <span className="error-message"></span>
          </div>
          <br />
          <div className="input-group">
            <label htmlFor="username" className="label">Username</label>
            <input type="text" id="username" className="input" />
            <span className="error-message"></span>
          </div>
          <br />
          <div className="input-group">
            <label htmlFor="password" className="label">Password</label>
            <input type="password" id="password" className="input" />
            <span className="error-message"></span>
          </div>
          <br />
          <button className="button" type="submit">Sign up</button>
        </form>
        <form className="signinForm" action="/signin.html" method="get"> {/* Vérifiez aussi ici l'action et la méthode */}
          <a className="link" href="/signin.html">Already have an account? Sign in here!</a>
        </form>
      </div>
    )
}

export default Login;