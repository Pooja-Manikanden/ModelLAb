
import { useAuth0 } from "@auth0/auth0-react";
import './App.css';

function App() {
  const {
    isLoading,
    isAuthenticated,
    user,
    error,
    loginWithRedirect,
    logout
  } = useAuth0();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Authentication error: {error.message}</p>;
  }

  return (
    <div>
      <h1>Student Login System</h1>
      <p>Authentication using Auth0</p>

      {!isAuthenticated ? (
        <div>
          <p>Please log in to view your student profile.</p>
          <button onClick={() => loginWithRedirect()}>
            Login with Auth0
          </button>
        </div>
      ) : (
        <div>
          <h2>Student Profile</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>

          {user.picture && (
            <img src={user.picture} alt="Student profile" width="80" />
          )}

          <p>Authentication successful!</p>

          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin
                }
              })
            }
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
