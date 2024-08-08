import { useNavigate } from "react-router-dom"
import { BookingAddNav } from "../templates/SiteNavBar"
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Select from "react-select";
import { addDoc, collection } from "firebase/firestore";
import { dB } from "../firebase";

export default function AddItem() {
    const navigate = useNavigate();
    const [itemClass, setItemClass] = useState([]);
    const [itemName, setItemName] = useState("");
    const classOptions = [
        {value: "logistics", label: "logistics"},
        {value: "demo", label: "demo"},
        {value: "testing", label: "testing"}
    ];

    function handleSelection(e) {
        const permissionSelected = e.map(({value} ) => {
            return value;
        });
        setItemClass(permissionSelected);
    }

    async function AddItemDatabase() {
        await addDoc(collection(dB, "items"), {itemClass: itemClass, itemName: itemName, itemState: "inventory"});
        navigate("/");
    }

    return (
        <>
        <BookingAddNav />
        <Container>
            <h1 style={{ marginBlock: "1rem" }}>Add Item</h1>
            <Form>
                <Form.Group className="mb-3" controlId="userName">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter item name"
                        onChange={(text) => setItemName(text.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="permissions">
                    <Form.Label>Item Access Permissions</Form.Label>
                    <Select closeMenuOnSelect={false}
                        options={classOptions}
                        onChange={handleSelection}
                        isMulti />
                </Form.Group>
            </Form>
            <Button variant="primary" onClick={async (e) => AddItemDatabase()}>
                Submit
            </Button>
        </Container>
        </>
    )
}