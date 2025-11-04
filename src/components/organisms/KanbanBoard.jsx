import { useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion } from "framer-motion";
import DealCard from "@/components/molecules/DealCard";
import ApperIcon from "@/components/ApperIcon";

const KanbanColumn = ({ stage, deals, onDrop, onEdit, onDelete }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "deal",
    drop: (item) => {
      if (item.stage !== stage) {
        onDrop(item.id, stage);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const stageColors = {
    Lead: "bg-blue-100 border-blue-300 text-blue-800",
    Qualified: "bg-green-100 border-green-300 text-green-800",
    Proposal: "bg-yellow-100 border-yellow-300 text-yellow-800",
    Negotiation: "bg-orange-100 border-orange-300 text-orange-800",
    Closed: "bg-purple-100 border-purple-300 text-purple-800"
  };

  const stageIcons = {
    Lead: "Users",
    Qualified: "UserCheck",
    Proposal: "FileText",
    Negotiation: "MessageCircle",
    Closed: "CheckCircle"
  };

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-64 bg-gray-50 rounded-lg p-4 transition-all duration-200 ${
        isOver ? "bg-primary-50 border-2 border-primary-300 border-dashed" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg border ${stageColors[stage]}`}>
            <ApperIcon name={stageIcons[stage]} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{stage}</h3>
            <p className="text-sm text-gray-500">
              {deals.length} deals • ${totalValue.toLocaleString()}
            </p>
          </div>
        </div>
        <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
          {deals.length}
        </span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {deals.map((deal, index) => (
          <DealCard
            key={deal.Id}
            deal={deal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        
        {deals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No deals in this stage</p>
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = ({ deals, onDealUpdate, onEdit, onDelete }) => {
  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"];

  const handleDrop = (dealId, newStage) => {
    onDealUpdate(dealId, { stage: newStage });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {stages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stage === stage);
          
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: stages.indexOf(stage) * 0.1 }}
            >
              <KanbanColumn
                stage={stage}
                deals={stageDeals}
                onDrop={handleDrop}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </motion.div>
          );
        })}
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;