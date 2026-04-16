import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api/api";
import "./Departments.css";

function Departments() {

    const [departments, setDepartments] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);

    /* FETCH DEPARTMENTS */

    const fetchDepartments = async () => {
        try {
            const res = await api.get("/departments");
            setDepartments(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    /* ADD OR UPDATE DEPARTMENT */

    const handleSubmit = async () => {

        if (!name.trim()) {
            alert("Department name is required");
            return;
        }

        try {

            if (editingId) {

                /* UPDATE */

                await api.put(`/departments/${editingId}`, {
                    name
                });

            } else {

                /* ADD */

                await api.post("/departments", {
                    name
                });

            }

            setName("");
            setEditingId(null);
            fetchDepartments();

        } catch (err) {
            console.log(err);
        }
    };

    /* EDIT BUTTON */

    const handleEdit = (dept) => {

        setEditingId(dept.id);
        setName(dept.name);

    };
    /* DELETE */
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this department?"
        );
        if (!confirmDelete) return;
        try {
            await api.delete(`/departments/${id}`);
            fetchDepartments();

        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Layout>
            <div className="departments">
                <h2>Departments</h2>
                {/* ADD / UPDATE SECTION */}
                <div className="add-section">
                    <input
                        type="text"
                        placeholder="Department Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={handleSubmit}>
                        {editingId ? "Update Department" : "Add Department"}
                    </button>
                </div>

                {/* TABLE */}

                <table>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.id}>
                                {/* <td>{dept.id}</td> */}
                                <td>{dept.name}</td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(dept)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(dept.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

export default Departments;