import { useState, useEffect } from "react";
import ContactTable from "@/components/organisms/ContactTable";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    address: "",
    notes: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Contacts loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      address: "",
      notes: ""
    });
    setFormErrors({});
    setEditingContact(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      position: contact.position || "",
      address: contact.address || "",
      notes: contact.notes || ""
    });
    setEditingContact(contact);
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    try {
      await contactService.delete(id);
      setContacts(contacts.filter(c => c.Id !== id));
      toast.success("Contact deleted successfully");
    } catch (error) {
      toast.error("Failed to delete contact");
      console.error("Delete error:", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.company.trim()) errors.company = "Company is required";
    if (!formData.position.trim()) errors.position = "Position is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      if (editingContact) {
        const updated = await contactService.update(editingContact.Id, formData);
        setContacts(contacts.map(c => c.Id === editingContact.Id ? updated : c));
        toast.success("Contact updated successfully");
      } else {
        const created = await contactService.create(formData);
        setContacts([...contacts, created]);
        toast.success("Contact created successfully");
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(editingContact ? "Failed to update contact" : "Failed to create contact");
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadContacts} type="inline" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
        <p className="text-gray-600">
          Manage your customer relationships and contact information.
        </p>
      </div>

      {/* Contact Table */}
      <ContactTable
        contacts={contacts}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingContact ? "Edit Contact" : "Add New Contact"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={formErrors.name}
              placeholder="Enter full name"
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={formErrors.email}
              placeholder="Enter email address"
            />

            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={formErrors.phone}
              placeholder="Enter phone number"
            />

            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
              error={formErrors.company}
              placeholder="Enter company name"
            />

            <Input
              label="Position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              error={formErrors.position}
              placeholder="Enter job title"
            />

            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              error={formErrors.address}
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={4}
              className="input-premium resize-none"
              placeholder="Enter any additional notes about this contact"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              icon={editingContact ? "Save" : "Plus"}
            >
              {editingContact ? "Update Contact" : "Add Contact"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Contacts;