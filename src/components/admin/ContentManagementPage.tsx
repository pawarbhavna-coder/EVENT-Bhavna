import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Edit, Save, Plus, Trash2, FileText, Image, Video, AlertTriangle, X } from 'lucide-react';
import '../../styles/admin-panel.css';

interface ContentBlock {
  id: string;
  page: string;
  section: string;
  content: string;
  type: 'text' | 'image' | 'video';
}

const mockContent: ContentBlock[] = [
  { id: '1', page: 'Home', section: 'Hero Title', content: 'Event Websites', type: 'text' },
  { id: '2', page: 'Home', section: 'Hero Subtitle', content: 'A unique event filled with networking, workshops, seminars, and engaging conversations with the industry\'s leading experts.', type: 'text' },
  { id: '3', page: 'About', section: 'Main Heading', content: 'ABOUT EVENTEASE', type: 'text' },
  { id: '4', page: 'Contact', section: 'Header', content: 'CONTACT', type: 'text' },
  { id: '5', page: 'Home', section: 'Featured Event Image', content: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg', type: 'image' },
];

const ContentManagementPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [content, setContent] = useState<ContentBlock[]>(mockContent);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContentData, setNewContentData] = useState<Omit<ContentBlock, 'id'>>({
    page: '',
    section: '',
    content: '',
    type: 'text',
  });

  React.useEffect(() => {
    setBreadcrumbs(['Global Content Management']);
  }, [setBreadcrumbs]);

  const handleEdit = (block: ContentBlock) => {
    setEditingId(block.id);
    setEditedContent(block.content);
  };

  const handleSave = (id: string) => {
    setContent(content.map(c => c.id === id ? { ...c, content: editedContent } : c));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };
  
  const handleDelete = (id: string) => {
      if (window.confirm('Are you sure you want to delete this content block? This action cannot be undone.')) {
          setContent(content.filter(c => c.id !== id));
      }
  };

  const handleAddNewContent = (e: React.FormEvent) => {
    e.preventDefault();
    const newBlock: ContentBlock = {
      id: `content-${Date.now()}`,
      ...newContentData,
    };
    setContent([...content, newBlock]);
    setShowAddModal(false);
    setNewContentData({ page: '', section: '', content: '', type: 'text' });
  };


  const getIcon = (type: 'text' | 'image' | 'video') => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5 text-gray-500 flex-shrink-0" />;
      case 'video': return <Video className="w-5 h-5 text-gray-500 flex-shrink-0" />;
      default: return <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    }
  };

  const AddContentModal = () => (
    <div className="admin-modal-overlay">
        <div className="admin-modal">
            <div className="admin-modal-header">
                <h3 className="admin-modal-title">Add New Content Block</h3>
                <button onClick={() => setShowAddModal(false)} className="admin-modal-close"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddNewContent}>
                <div className="admin-modal-body space-y-4">
                    <div className="admin-form-group">
                        <label className="admin-form-label">Page</label>
                        <input type="text" value={newContentData.page} onChange={(e) => setNewContentData({...newContentData, page: e.target.value})} autoComplete="off" className="admin-form-input" required placeholder="e.g., Home, About" />
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Section</label>
                        <input type="text" value={newContentData.section} onChange={(e) => setNewContentData({...newContentData, section: e.target.value})} autoComplete="off" className="admin-form-input" required placeholder="e.g., Hero Title, Main Banner"/>
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Type</label>
                        <select value={newContentData.type} onChange={(e) => setNewContentData({...newContentData, type: e.target.value as any})} className="admin-form-select">
                            <option value="text">Text</option>
                            <option value="image">Image URL</option>
                            <option value="video">Video URL</option>
                        </select>
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Content</label>
                        <textarea value={newContentData.content} onChange={(e) => setNewContentData({...newContentData, content: e.target.value})} className="admin-form-input" rows={4} required placeholder="Enter the text or URL..."/>
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <button type="button" onClick={() => setShowAddModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
                    <button type="submit" className="admin-btn admin-btn-primary">Add Content</button>
                </div>
            </form>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Global Content Management</h1>
            <button
                onClick={() => setShowAddModal(true)}
                className="admin-btn admin-btn-primary">
                <Plus className="w-4 h-4" />
                <span>Add Content Block</span>
            </button>
        </div>

        <div className="admin-alert admin-alert-warning">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
                Changes made here will affect the live website content. Please be certain before saving.
            </p>
        </div>

        <div className="admin-table-container">
            <div className="overflow-x-auto">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Page</th>
                            <th>Section</th>
                            <th>Content</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.map((block) => (
                            <tr key={block.id}>
                                <td>{block.page}</td>
                                <td>{block.section}</td>
                                <td className="max-w-sm">
                                    {editingId === block.id ? (
                                        <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="admin-form-input" rows={3}/>
                                    ) : (
                                        <div className="flex items-start gap-2">
                                            {getIcon(block.type)}
                                            <p className="text-gray-700 truncate">{block.content}</p>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        {editingId === block.id ? (
                                            <>
                                                <button onClick={() => handleSave(block.id)} className="admin-action-btn admin-tooltip" data-tooltip="Save"><Save className="w-4 h-4 text-green-600"/></button>
                                                <button onClick={handleCancel} className="admin-action-btn admin-tooltip" data-tooltip="Cancel"><X className="w-4 h-4"/></button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(block)} className="admin-action-btn admin-tooltip" data-tooltip="Edit"><Edit className="w-4 h-4"/></button>
                                                <button onClick={() => handleDelete(block.id)} className="admin-action-btn danger admin-tooltip" data-tooltip="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {content.length === 0 && (
                <div className="admin-empty-state">
                    <FileText className="admin-empty-icon" />
                    <h3 className="admin-empty-title">No Content Blocks</h3>
                    <p className="admin-empty-description">
                        Add a content block to start managing your site's content.
                    </p>
                </div>
            )}
        </div>
        {showAddModal && <AddContentModal />}
      </div>
    </div>
  );
};

export default ContentManagementPage;
