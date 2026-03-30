import React, { useState } from 'react';
import { X, Map as MapIcon, Upload, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
function POIForm({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Điểm chính (MAIN)',
    description: '',
    address: '',
    radius: 10,
    lat: 10.7612,
    lng: 106.7012,
    languages: ['Vietnamese', 'English'],
  });

  const languages = [
    'Vietnamese', 'English', 'Spanish', 'French', 'German', 'Italian',
    'Portuguese', 'Russian', 'Chinese (Simplified)', 'Japanese', 'Korean', 'Thai'
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
        >
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Thêm POI mới</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Tên POI"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
              >
                <option>Điểm chính (MAIN)</option>
                <option>Ẩm thực</option>
                <option>Giải trí</option>
                <option>Lịch sử</option>
              </select>

              <textarea
                placeholder="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <input
                type="text"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border"
              />

              <input
                type="number"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border"
              />
            </div>

            <div className="space-y-6">
              <div className="h-[200px] bg-gray-100 flex items-center justify-center rounded-xl">
                <MapIcon />
              </div>

              <div className="border p-4 rounded-xl text-center cursor-pointer">
                <Upload />
                <p>Upload ảnh</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <label key={lang}>
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            languages: [...formData.languages, lang],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            languages: formData.languages.filter(l => l !== lang),
                          });
                        }
                      }}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 flex justify-end gap-4">
            <button onClick={onClose}>Hủy</button>

            <button>
              <Sparkles size={18} />
              Sinh nội dung
            </button>

            <button
              onClick={() => onSave(formData)}
              className="bg-emerald-500 text-white px-4 py-2 rounded"
            >
              Lưu
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default POIForm;