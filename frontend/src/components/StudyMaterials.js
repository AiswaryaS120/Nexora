import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Code, Download, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function StudyMaterials() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const materials = {
    aptitude: [
      {
        id: 1,
        title: "Logical Ability",
        description: "500+ logical reasoning questions with detailed solutions",
        fileName: "SP_Logical Ability.pdf",
        size: "578 kB",
        topics: ["Puzzles", "Seating Arrangement", "Blood Relations", "Coding-Decoding"]
      },
      {
        id: 2,
        title: "Verbal Ability",
        description: "Complete verbal ability preparation material",
        fileName: "SP_English.pdf",
        size: "510 kB",
        topics: ["Synonyms", "Antonyms", "Reading Comprehension", "Grammar"]
      },
      {
        id: 3,
        title: "Quantitative Ability",
        description: "Quantitative aptitude practice questions",
        fileName: "SP_Quantitative Ability_Tech.pdf",
        size: "567 kB",
        topics: ["Percentages", "Ratios", "Time & Work", "Speed & Distance"]
      }
    ],
    coding: [
      {
        id: 1,
        title: "Amcat Programme",
        description: "In-depth coverage of all major amcat topics",
        fileName: "amcat prog.pdf",
        size: "521 kB",
        topics: ["Arrays", "Linked Lists", "Trees", "Graphs", "Hash Tables"]
      }
    ]
  };

  const handleDownload = (fileName, category) => {
    try {
      const pdfPath = `${process.env.PUBLIC_URL}/study-materials/${category}/${fileName}`;

      const link = document.createElement('a');
      link.href = pdfPath;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Opening ${fileName}...`);
    } catch (error) {
      toast.error('Failed to open PDF. Please check if the file exists.');
      console.error('Download error:', error);
    }
  };

  const categories = [
    {
      id: 'aptitude',
      name: 'Aptitude Materials',
      icon: Brain,
      color: '#e8c441',
      description: 'Quantitative, Logical & Verbal preparation materials',
      count: materials.aptitude.length
    },
    {
      id: 'coding',
      name: 'Coding Materials',
      icon: Code,
      color: '#10b981',
      description: 'Data Structures, Algorithms & Programming concepts',
      count: materials.coding.length
    }
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: '#011024',
        color: '#e8c441',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
      }}>
        <button
          onClick={() => selectedCategory ? setSelectedCategory(null) : navigate('/dashboard')}
          style={{
            background: 'none',
            border: 'none',
            color: '#e8c441',
            fontSize: '1.15rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem'
          }}
        >
          <ArrowLeft size={20} />
          {selectedCategory ? 'Back to Categories' : 'Back to Dashboard'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BookOpen size={28} />
          <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>Study Materials</span>
        </div>

        <div style={{ width: '150px' }} />
      </div>

      <div style={{ height: '70px' }} />

      <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {!selectedCategory ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#011024',
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              Choose Your Study Category
            </h1>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {categories.map(category => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2.5rem',
                    border: `3px solid ${category.color}`,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: `${category.color}20`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    {React.createElement(category.icon, { size: 36, color: category.color })}
                  </div>

                  <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#011024'
                  }}>
                    {category.name}
                  </h2>

                  <p style={{ color: '#6b7280', margin: '1rem 0' }}>
                    {category.description}
                  </p>

                  <div style={{
                    color: category.color,
                    fontWeight: 600
                  }}>
                    {category.count} Materials Available
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {materials[selectedCategory].map(material => (
              <div key={material.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                border: '2px solid #e5e7eb',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ color: '#011024', fontSize: '1.5rem' }}>
                  {material.title}
                </h3>

                <p style={{ color: '#6b7280' }}>
                  {material.description}
                </p>

                <button
                  onClick={() => handleDownload(material.fileName, selectedCategory)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1.5rem',
                    background: '#011024',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={18} /> Download
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
