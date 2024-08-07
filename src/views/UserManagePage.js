import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { checkAdmin } from "../extFunctions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ManageAddNav } from "../templates/SiteNavBar";

export default function UserManage() {
    const [user, loading] = useAuthState(auth);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) {
            setIsAdmin(checkAdmin(user.uid));
            if (!isAdmin) {
                return navigate("/");
            }
        }
    }, [])
    
    return (
        <>
        <ManageAddNav />
            <Container>
                Test
            </Container>
        </>
    )
}