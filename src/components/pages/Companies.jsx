import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import companyService from "@/services/api/companyService";
import { toast } from "react-toastify";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    employeeCount: "",
    foundedYear: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies");
      console.error("Error loading companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      industry: "",
      website: "",
      phone: "",
      email: "",
      address: "",
      description: "",
      employeeCount: "",
      foundedYear: ""
    });
    setFormErrors({});
    setEditingCompany(null);
  };

  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || "",
      industry: company.industry || "",
      website: company.website || "",
      phone: company.phone || "",
      email: company.email || "",
      address: company.address || "",
      description: company.description || "",
      employeeCount: company.employeeCount?.toString() || "",
      foundedYear: company.foundedYear?.toString() || ""
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (company) => {
    if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        await companyService.delete(company.Id);
        setCompanies(companies.filter(c => c.Id !== company.Id));
        toast.success("Company deleted successfully");
      } catch (err) {
        toast.error("Failed to delete company");
        console.error("Error deleting company:", err);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Company name is required";
    if (!formData.industry.trim()) errors.industry = "Industry is required";
    if (formData.website && !formData.website.match(/^https?:\/\/.+/)) {
      errors.website = "Website must be a valid URL";
    }
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Email must be valid";
    }
    if (formData.employeeCount && !formData.employeeCount.match(/^\d+$/)) {
      errors.employeeCount = "Employee count must be a number";
    }
    if (formData.foundedYear && !formData.foundedYear.match(/^\d{4}$/)) {
      errors.foundedYear = "Founded year must be a 4-digit year";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const submitData = {
        ...formData,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null
      };

      if (editingCompany) {
        const updated = await companyService.update(editingCompany.Id, submitData);
        setCompanies(companies.map(c => c.Id === editingCompany.Id ? updated : c));
        toast.success("Company updated successfully");
      } else {
        const created = await companyService.create(submitData);
        setCompanies([...companies, created]);
        toast.success("Company created successfully");
      }
      
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(editingCompany ? "Failed to update company" : "Failed to create company");
      console.error("Error saving company:", err);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage your company database</p>
        </div>
        <Button onClick={handleCreate} className="btn-primary">
          <ApperIcon name="Plus" size={20} />
          Add Company
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary-700">{companies.length}</div>
          <div className="text-sm text-primary-600">Total Companies</div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <motion.div
            key={company.Id}
            className="card-premium p-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{company.name}</h3>
                <p className="text-sm text-gray-600">{company.industry}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(company)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50"
                >
                  <ApperIcon name="Edit" size={16} />
                </button>
                <button
                  onClick={() => handleDelete(company)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {company.website && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Globe" size={14} />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 truncate">
                    {company.website}
                  </a>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Phone" size={14} />
                  <span>{company.phone}</span>
                </div>
              )}
              {company.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Mail" size={14} />
                  <span className="truncate">{company.email}</span>
                </div>
              )}
              {company.employeeCount && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ApperIcon name="Users" size={14} />
                  <span>{company.employeeCount} employees</span>
                </div>
              )}
            </div>

            {company.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
            )}

            {company.foundedYear && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500">Founded {company.foundedYear}</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredCompanies.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCompany ? "Edit Company" : "Add New Company"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={formErrors.name}
              placeholder="Enter company name"
              required
            />
            <Input
              label="Industry"
              value={formData.industry}
              onChange={(e) => handleInputChange("industry", e.target.value)}
              error={formErrors.industry}
              placeholder="e.g., Technology, Healthcare"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              error={formErrors.website}
              placeholder="https://company.com"
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              error={formErrors.phone}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={formErrors.email}
            placeholder="contact@company.com"
          />

          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            error={formErrors.address}
            placeholder="123 Business St, City, State 12345"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Employee Count"
              type="number"
              value={formData.employeeCount}
              onChange={(e) => handleInputChange("employeeCount", e.target.value)}
              error={formErrors.employeeCount}
              placeholder="50"
              min="1"
            />
            <Input
              label="Founded Year"
              type="number"
              value={formData.foundedYear}
              onChange={(e) => handleInputChange("foundedYear", e.target.value)}
              error={formErrors.foundedYear}
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the company..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-primary">
              {editingCompany ? "Update Company" : "Create Company"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;