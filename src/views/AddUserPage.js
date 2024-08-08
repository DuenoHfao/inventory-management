import { useEffect, useState } from "react";
import { ManageAddNav } from "../templates/SiteNavBar";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, dB } from "../firebase";
import { Container, Form, Button } from "react-bootstrap";
import Select from "react-select";
import { addDoc,collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { adminList } from "../extFunctions";
import { useAuthState } from "react-firebase-hooks/auth";

export default function AddUser() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [uid, setUID] = useState("");
    const [userPermissions, setUserPermissions] = useState([]);
    const [userSuccess, setUserSuccess] = useState(false);
    const permissionOptions = [
        {value: "logistics", label: "logistics"},
        {value: "demo", label: "demo"},
        {value: "testing", label: "testing"}
    ];
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);

    async function addUser() {
        createUserWithEmailAndPassword(auth, email ,password).then((userCredentials) => {
            setUID(userCredentials.user.uid);
            setUserSuccess(true);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.Message;
            console.log(`${errorCode}: ${errorMessage}`);
        });
        await addDoc(collection(dB, "users"), {userID: uid, userName: userName, permission: userPermissions}).then(() => {
        });

        navigate("/userManage");
    }

    function handleSelection(e) {
        const permissionSelected = e.map(({value}) => {
            return value;
        });
        setUserPermissions(permissionSelected);
    }

    useEffect(() => {
        if (loading) return;
        if (user) {
            const checkAdmin = adminList.includes(user.uid);
            if (!checkAdmin) {
                navigate("/");
            }
        }
    }, [user, loading]);

    return (
        <>
            <ManageAddNav />
            <Container>
            <h1 style={{ marginBlock: "1rem" }}>Add User</h1>
            <Form>
                <Form.Group className="mb-3" controlId="userName">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        onChange={(text) => setUserName(text.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter email"
                        onChange={(text) => setEmail(text.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        onChange={(text) => setPassword(text.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="permissions">
                    <Form.Label>Permissions</Form.Label>
                    <Select closeMenuOnSelect={false}
                        options={permissionOptions}
                        onChange={handleSelection}
                        isMulti />
                </Form.Group>
                <Button variant="primary" onClick={async (e) => addUser()}>
                    Submit
                </Button>
            </Form>
            {userSuccess && <div>User successfully created!</div>}
            </Container>
        </>
    )
}