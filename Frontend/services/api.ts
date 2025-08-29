const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface LoginResponse {
  token: string;
  user: any;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error' };
    }
  }

  // Authentication
  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.data && typeof response.data === 'object' && 'token' in response.data) {
      localStorage.setItem('auth_token', response.data.token as string);
    }

    return response;
  }

  setAuthToken(token: string | null) {
    // This method is called by AuthContext but tokens are handled in getAuthHeaders
    // No additional action needed as getAuthHeaders reads from localStorage
  }

  async getCurrentUser() {
    const response = await this.request('/auth/me');
    if (response.data && (response.data as any).user) {
      return { data: (response.data as any).user };
    }
    return response;
  }

  async logout() {
    localStorage.removeItem('auth_token');
  }

  async verifyEmail(code: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  // Posts
  async getPosts(params?: {
    status?: string;
    category?: string;
    author?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/posts?${queryParams.toString()}`);
  }

  async getPost(slug: string) {
    return this.request(`/posts/${slug}`);
  }

  async createPost(postData: any) {
    // Transform the data to match backend expectations
    const transformedData = {
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      imageUrl: postData.imageUrl,
      authorId: postData.author?.id,
      categoryId: postData.category?.id,
      tags: postData.tags || [],
      readingTime: postData.readingTime || 0,
      featured: postData.featured || false,
      status: postData.status || 'draft'
    };

    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(transformedData)
    });
  }

  async updatePost(id: string, postData: any) {
    // Transform the data to match backend expectations
    const transformedData = {
      title: postData.title,
      excerpt: postData.excerpt,
      content: postData.content,
      imageUrl: postData.imageUrl,
      authorId: postData.author?.id,
      categoryId: postData.category?.id,
      tags: postData.tags || [],
      readingTime: postData.readingTime || 0,
      featured: postData.featured || false,
      status: postData.status || 'draft'
    };

    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformedData)
    });
  }

  async deletePost(id: string) {
    return this.request(`/posts/${id}`, {
      method: 'DELETE'
    });
  }

  async likePost(id: string) {
    return this.request(`/posts/${id}/like`, {
      method: 'POST'
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(id: string) {
    return this.request(`/categories/${id}`);
  }

  // Tags
  async getTags() {
    return this.request('/tags');
  }

  async getTag(id: string) {
    return this.request(`/tags/${id}`);
  }

  async createCategory(categoryData: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // Authors
  async getAuthors() {
    return this.request('/authors');
  }

  async getAuthor(id: string) {
    return this.request(`/authors/${id}`);
  }

  async createAuthor(authorData: any) {
    return this.request('/authors', {
      method: 'POST',
      body: JSON.stringify(authorData)
    });
  }

  async updateAuthor(id: string, authorData: any) {
    return this.request(`/authors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(authorData)
    });
  }

  async deleteAuthor(id: string) {
    return this.request(`/authors/${id}`, {
      method: 'DELETE'
    });
  }

  // Comments
  async getPostComments(postId: string, status = 'approved') {
    return this.request(`/comments/post/${postId}?status=${status}`);
  }

  async getAllComments(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/comments${query}`);
  }

  async createComment(commentData: any) {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  async updateCommentStatus(id: string, status: string) {
    return this.request(`/comments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteComment(id: string) {
    return this.request(`/comments/${id}`, {
      method: 'DELETE'
    });
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  // Site Settings
  async getSiteSettings() {
    return this.request('/settings');
  }

  async updateSiteSettings(settings: any) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Subscribers
  async getSubscribers() {
    return this.request('/subscribers');
  }

  async subscribe(email: string) {
    return this.request('/subscribers/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async unsubscribe(email: string) {
    return this.request('/subscribers/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async deleteSubscriber(id: string) {
    return this.request(`/subscribers/${id}`, {
      method: 'DELETE'
    });
  }

  // Contact
  async getContactMessages() {
    return this.request('/contact');
  }

  async submitContactForm(formData: { name: string; email: string; message: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors specifically
        if (response.status === 400 && data.errors) {
          const errorMessages = data.errors.map((err: any) => err.msg).join(', ');
          return { error: errorMessages };
        }
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('Contact form submission failed:', error);
      return { error: 'Network error' };
    }
  }

  async deleteContactMessage(id: string) {
    return this.request(`/contact/${id}`, {
      method: 'DELETE'
    });
  }

  // Pages
  async getPages() {
    return this.request('/pages');
  }

  async getPage(slug: string) {
    return this.request(`/pages/${slug}`);
  }

  async createPage(pageData: any) {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify(pageData)
    });
  }

  async updatePage(id: string, pageData: any) {
    return this.request(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pageData)
    });
  }

  async deletePage(id: string) {
    return this.request(`/pages/${id}`, {
      method: 'DELETE'
    });
  }

  // Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('auth_token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Upload failed' };
      }

      return { data };
    } catch (error) {
      console.error('Upload failed:', error);
      return { error: 'Network error' };
    }
  }

  async deleteImage(filename: string) {
    return this.request(`/upload/image/${filename}`, {
      method: 'DELETE'
    });
  }
}

export const apiService = new ApiService();
export default apiService;
