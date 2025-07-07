# Comprehensive Booking and Service Management System

## Overview

This system provides a complete solution for managing services, sub-services, and bookings in a removal company. It includes both admin management interfaces and public booking forms.

## System Architecture

### 1. Database Models

#### Service Model (`src/app/models/service.ts`)
```typescript
interface IService {
  name: string
  description: string
  isActive: boolean
  basePrice?: number
  priceType: "fixed" | "hourly" | "per_item" | "custom"
  category: string
  createdAt: Date
  updatedAt: Date
}
```

#### Sub-Service Model (`src/app/models/sub-service.ts`)
```typescript
interface ISubService {
  serviceId: mongoose.Types.ObjectId
  name: string
  description: string
  price: number
  priceType: "fixed" | "hourly" | "per_item"
  estimatedDuration?: string
  isActive: boolean
  features: string[]
  createdAt: Date
  updatedAt: Date
}
```

#### Booking Model (`src/app/models/booking.ts`)
```typescript
interface IBooking {
  bookingId: string
  fullName: string
  emailAddress: string
  phoneNumber: string
  serviceId: string
  serviceName: string
  subServiceId?: string
  subServiceName?: string
  subServicePrice?: number
  details: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  submittedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### 2. API Endpoints

#### Public Booking API (`/api/bookings`)
- **POST**: Create new booking (public access)
- **GET**: Fetch all bookings (admin only)

#### Individual Booking Management (`/api/bookings/[id]`)
- **GET**: Get specific booking details (admin only)
- **PUT**: Update booking status and details (admin only)
- **DELETE**: Delete booking (admin only)

#### Service Management (`/api/admin/services`)
- **GET**: Fetch all services (admin only)
- **POST**: Create new service (admin only)

#### Individual Service Management (`/api/admin/services/[serviceId]`)
- **PUT**: Update service (admin only)
- **DELETE**: Delete service and all sub-services (admin only)

#### Sub-Service Management (`/api/admin/services/[serviceId]/sub-services`)
- **GET**: Fetch sub-services for a service (admin only)
- **POST**: Create new sub-service (admin only)

#### Individual Sub-Service Management (`/api/admin/sub-services/[subServiceId]`)
- **PUT**: Update sub-service (admin only)
- **DELETE**: Delete sub-service (admin only)

### 3. Frontend Components

#### Admin Components

1. **Enhanced Service Management** (`components/enhanced-service-management.tsx`)
   - Complete service and sub-service management
   - Add, edit, delete services and sub-services
   - Real-time updates and validation
   - Modern UI with modals and confirmations

2. **Bookings Manager** (`components/bookings-manager.tsx`)
   - View all bookings with filtering and search
   - Update booking status
   - Delete bookings
   - Detailed booking information

3. **Booking Details** (`components/booking-details.tsx`)
   - Detailed view of individual bookings
   - Status updates
   - Notes and comments

#### Public Components

1. **Comprehensive Booking Form** (`components/comprehensive-booking-form.tsx`)
   - Dynamic service and sub-service selection
   - Detailed requirements form
   - Validation and error handling
   - Real-time service information display

2. **Simple Booking Form** (`components/simple-booking-form.tsx`)
   - Streamlined booking process
   - Basic service selection
   - Quick submission

## Features

### Admin Features

1. **Service Management**
   - Create, edit, and delete services
   - Set base prices and pricing types
   - Categorize services
   - Activate/deactivate services

2. **Sub-Service Management**
   - Create sub-services under main services
   - Set individual pricing
   - Add features and descriptions
   - Set estimated duration

3. **Booking Management**
   - View all bookings with filters
   - Update booking status
   - Add notes and comments
   - Delete bookings
   - Export booking data

4. **Dashboard Analytics**
   - Booking statistics
   - Revenue tracking
   - Service popularity metrics

### Public Features

1. **Dynamic Service Selection**
   - Browse available services
   - View service details and pricing
   - Select sub-services
   - Real-time price calculation

2. **Comprehensive Booking Form**
   - Personal information collection
   - Detailed requirements
   - Preferred dates and times
   - Special requirements
   - Address information

3. **Validation and Error Handling**
   - Form validation
   - Email format validation
   - Phone number validation
   - Required field checking

## Usage Guide

### For Administrators

1. **Setting Up Services**
   ```
   1. Navigate to Admin Panel > Enhanced Services
   2. Click "Add New Service"
   3. Fill in service details (name, description, category, pricing)
   4. Save the service
   5. Add sub-services by clicking "Add Sub-Service" on the service card
   ```

2. **Managing Bookings**
   ```
   1. Navigate to Admin Panel > Bookings
   2. View all bookings with filters
   3. Click on a booking to view details
   4. Update status or add notes
   5. Delete bookings if necessary
   ```

3. **Service Configuration**
   ```
   1. Services can be activated/deactivated
   2. Pricing can be set as fixed, hourly, per-item, or custom
   3. Categories help organize services
   4. Sub-services inherit from parent services
   ```

### For Customers

1. **Making a Booking**
   ```
   1. Visit the booking page
   2. Fill in personal information
   3. Select a service from the dropdown
   4. Optionally select a sub-service
   5. Provide detailed requirements
   6. Set preferred date/time
   7. Submit the booking
   ```

2. **Service Information**
   ```
   1. View service descriptions and pricing
   2. See sub-service options and features
   3. Understand pricing structure
   4. View estimated duration
   ```

## Technical Implementation

### Authentication
- NextAuth.js for session management
- Role-based access control (admin/user)
- Protected admin routes

### Database
- MongoDB with Mongoose ODM
- Proper indexing for performance
- Data validation and sanitization

### API Design
- RESTful API endpoints
- Proper error handling
- Input validation
- Response formatting

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Responsive design
- Real-time updates

## Security Features

1. **Authentication & Authorization**
   - Session-based authentication
   - Role-based access control
   - Protected admin routes

2. **Input Validation**
   - Server-side validation
   - Client-side validation
   - SQL injection prevention
   - XSS protection

3. **Data Protection**
   - Email validation
   - Phone number validation
   - Required field enforcement
   - Data sanitization

## Error Handling

1. **API Errors**
   - Proper HTTP status codes
   - Descriptive error messages
   - Logging for debugging

2. **Frontend Errors**
   - User-friendly error messages
   - Toast notifications
   - Form validation feedback

3. **Database Errors**
   - Connection error handling
   - Duplicate key handling
   - Validation error handling

## Performance Optimizations

1. **Database**
   - Proper indexing
   - Efficient queries
   - Connection pooling

2. **Frontend**
   - Lazy loading
   - Caching strategies
   - Optimized re-renders

3. **API**
   - Response caching
   - Pagination
   - Efficient data fetching

## Deployment

### Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_app_url
```

### Build Process
```bash
npm install
npm run build
npm start
```

## Maintenance

### Regular Tasks
1. Monitor booking submissions
2. Update service pricing
3. Review and respond to bookings
4. Backup database
5. Update service availability

### Troubleshooting
1. Check API logs for errors
2. Verify database connectivity
3. Test booking flow
4. Monitor performance metrics

## Future Enhancements

1. **Payment Integration**
   - Online payment processing
   - Invoice generation
   - Payment tracking

2. **Communication System**
   - Email notifications
   - SMS alerts
   - Customer portal

3. **Advanced Analytics**
   - Booking trends
   - Revenue analytics
   - Customer insights

4. **Mobile App**
   - Native mobile application
   - Push notifications
   - Offline capabilities

## Support

For technical support or questions about the system, please refer to the documentation or contact the development team.

---

This system provides a robust foundation for managing a removal company's services and bookings, with room for future enhancements and scalability. 