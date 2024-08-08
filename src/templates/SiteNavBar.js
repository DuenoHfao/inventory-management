import { Nav, Navbar, Container } from "react-bootstrap";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { adminList } from "../extFunctions";


export function HomeNav() {
    const [user, loading] = useAuthState(auth);
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        if (loading) return;
        if (user) {
            const checkAdmin = adminList.includes(user.uid);
            setIsAdmin(checkAdmin);
        };
        
    }, [user, loading])

    return (
        <Navbar variant="light" bg="light">
            <Container>
            <Navbar.Brand href="/">Home</Navbar.Brand>
                <Nav>
                    {isAdmin && <Nav.Link href="/userManage">Manage Users</Nav.Link>}
                    <Nav.Link onClick={(e) => signOut(auth)}>Sign Out</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export function ManageAddNav() {
    const location = useLocation();
    const {pathname} = location;

    return (
        <Navbar variant="light" bg="light">
            <Container>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Nav>
                {pathname === "/addUser" &&<Nav.Link href="/userManage">Manage Users</Nav.Link>}
                {pathname === "/userManage" && <Nav.Link href={`/addUser`}>Add User</Nav.Link>}
                <Nav.Link href={`/login`} onClick={(e) => signOut(auth)}>Sign Out</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    )
}

export function BookingNav() {
    return (
        <Navbar variant="light" bg="light">
            <Container>
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Nav>
                <Nav.Link href={`/login`} onClick={(e) => signOut(auth)}>Sign Out</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    )
}