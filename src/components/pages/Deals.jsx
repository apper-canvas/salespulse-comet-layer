import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import { toast } from "react-toastify";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    value: "",
    stage: "Lead",
    assignedTo: "",
    probability: "",
    expectedCloseDate: "",
    contactId: "",
    notes: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const stageOptions = [
    { value: "Lead", label: "Lead" },
    { value: "Qualified", label: "Qualified" },
    { value: "Proposal", label: "Proposal" },
    { value: "Negotiation", label: "Negotiation" },
    { value: "Closed", label: "Closed" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load deals. Please try again.");
      console.error("Deals loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      companyName: "",
      value: "",
      stage: "Lead",
      assignedTo: "",
      probability: "",
      expectedCloseDate: "",
      contactId: "",
      notes: ""
    });
    setFormErrors({});
    setEditingDeal(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (deal) => {
    setFormData({
      companyName: deal.companyName || "",
      value: deal.value?.toString() || "",
      stage: deal.stage || "Lead",
      assignedTo: deal.assignedTo || "",
      probability: deal.probability?.toString() || "",
      expectedCloseDate: deal.expectedCloseDate || "",
      contactId: deal.contactId || "",
      notes: deal.notes || ""
    });
    setEditingDeal(deal);
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;

    try {
      await dealService.delete(id);
      setDeals(deals.filter(d => d.Id !== id));
      toast.success("Deal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete deal");
      console.error("Delete error:", error);
    }
  };

  const handleDealUpdate = async (dealId, updates) => {
    try {
      const updated = await dealService.update(dealId, updates);
      setDeals(deals.map(d => d.Id === dealId ? updated : d));
      toast.success("Deal updated successfully");
    } catch (error) {
      toast.error("Failed to update deal");
      console.error("Update error:", error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.companyName.trim()) errors.companyName = "Company name is required";
    if (!formData.value || isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      errors.value = "Valid deal value is required";
    }
    if (!formData.assignedTo.trim()) errors.assignedTo = "Assigned representative is required";
    if (!formData.probability || isNaN(formData.probability) || parseFloat(formData.probability) < 0 || parseFloat(formData.probability) > 100) {
      errors.probability = "Probability must be between 0 and 100";
    }
    if (!formData.expectedCloseDate) errors.expectedCloseDate = "Expected close date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseFloat(formData.probability)
      };

      if (editingDeal) {
        const updated = await dealService.update(editingDeal.Id, dealData);
        setDeals(deals.map(d => d.Id === editingDeal.Id ? updated : d));
        toast.success("Deal updated successfully");
      } else {
        const created = await dealService.create(dealData);
        setDeals([...deals, created]);
        toast.success("Deal created successfully");
      }
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(editingDeal ? "Failed to update deal" : "Failed to create deal");
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

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} type="inline" />;

  if (deals.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deals Pipeline</h1>
          <p className="text-gray-600">
            Track your sales opportunities through every stage of your pipeline.
          </p>
        </div>
        <Empty
          title="No deals yet"
          description="Start tracking your sales opportunities by creating your first deal"
          actionLabel="Add First Deal"
          onAction={handleAdd}
          icon="DollarSign"
          type="inline"
        />
      </div>
    );
  }

  const contactOptions = contacts.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.name} - ${contact.company}`
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Deals Pipeline</h1>
            <p className="text-gray-600">
              Track your sales opportunities through every stage of your pipeline.
            </p>
          </div>
          <Button onClick={handleAdd} icon="Plus">
            Add Deal
          </Button>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stageOptions.map(({ value: stage, label }) => {
            const stageDeals = deals.filter(deal => deal.stage === stage);
            const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
            
            return (
              <div key={stage} className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-1">{label}</h3>
                <p className="text-2xl font-bold text-primary-600">{stageDeals.length}</p>
                <p className="text-sm text-gray-500">${totalValue.toLocaleString()}</p>
              </div>
            );
          })}
        </div>

        {/* Kanban Board */}
        <KanbanBoard
          deals={deals}
          onDealUpdate={handleDealUpdate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          title={editingDeal ? "Edit Deal" : "Add New Deal"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                error={formErrors.companyName}
                placeholder="Enter company name"
              />

              <Input
                label="Deal Value"
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                error={formErrors.value}
                placeholder="Enter deal value"
              />

              <Select
                label="Stage"
                value={formData.stage}
                onChange={(e) => handleInputChange("stage", e.target.value)}
                options={stageOptions}
                error={formErrors.stage}
              />

              <Input
                label="Assigned To"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                error={formErrors.assignedTo}
                placeholder="Enter sales rep name"
              />

              <Input
                label="Probability (%)"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleInputChange("probability", e.target.value)}
                error={formErrors.probability}
                placeholder="Enter win probability"
              />

              <Input
                label="Expected Close Date"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                error={formErrors.expectedCloseDate}
              />

              <Select
                label="Related Contact"
                value={formData.contactId}
                onChange={(e) => handleInputChange("contactId", e.target.value)}
                options={contactOptions}
                placeholder="Select a contact"
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
                placeholder="Enter any additional notes about this deal"
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
                icon={editingDeal ? "Save" : "Plus"}
              >
                {editingDeal ? "Update Deal" : "Add Deal"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DndProvider>
  );
};

export default Deals;