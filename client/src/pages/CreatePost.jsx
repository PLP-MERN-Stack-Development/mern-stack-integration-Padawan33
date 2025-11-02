import React, { useState } from 'react';

export default function CreatePost() {
  // State for form fields
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  // State for file upload (will hold the File object)
  const [file, setFile] = useState(null);

  // Function to handle form submission (will be implemented in Task 4)
  async function createNewPost(e) {
    e.preventDefault();
    console.log('Form submitted:', { title, summary, content, file });
    alert('Form submitted! Check console for data.');
    // Actual API submission logic will go here
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px' }}>
        Create a New Blog Post
      </h2>
      <form onSubmit={createNewPost} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Title Field */}
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
            Post Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="A compelling title for your post"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
            required
          />
        </div>

        {/* Summary Field */}
        <div>
          <label htmlFor="summary" style={{ display: 'block', marginBottom: '5px' }}>
            Summary / Subtitle
          </label>
          <input
            id="summary"
            type="text"
            placeholder="A short, engaging summary"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
            required
          />
        </div>

        {/* File/Image Upload Field */}
        <div>
          <label htmlFor="cover-image" style={{ display: 'block', marginBottom: '5px' }}>
            Cover Image
          </label>
          <input
            id="cover-image"
            type="file"
            onChange={e => setFile(e.target.files[0])}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
          />
          {file && <p style={{ fontSize: '12px', marginTop: '5px' }}>Selected file: {file.name}</p>}
        </div>

        {/* Content Field */}
        <div>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px' }}>
            Post Content
          </label>
          <textarea
            id="content"
            placeholder="Write your main article content here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', minHeight: '200px' }}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" style={{ padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>
          Create Post
        </button>
      </form>
    </div>
  );
}