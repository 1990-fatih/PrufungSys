import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div>
        <nav style={{backgroundColor:"#589642"}} class="navbar navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand text-body text-start" href="#">
     <Link className="float-start" to={"/"}><img src="https://conmansys-bucket.s3.eu-central-1.amazonaws.com/public/orginal/BBZ_PNG-02.png" width="12%" alt="logo"/>    </Link>
      <span className="text-uppercase float-start" style={{color:"white"}}>Quiz App</span>
   
    </a>
  </div>
</nav>
    </div>
  )
}

export default Header