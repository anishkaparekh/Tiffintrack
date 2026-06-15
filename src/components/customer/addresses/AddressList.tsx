import React from 'react';
import { Address } from '../../../data/addressMockData';
import AddressCard from './AddressCard';
import EmptyState from './EmptyState';
import LoadingSkeleton from './LoadingSkeleton';

interface AddressListProps {
  addresses: Address[];
  isLoading: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function AddressList({ 
  addresses, 
  isLoading, 
  onEdit, 
  onDelete, 
  onSetDefault 
}: AddressListProps) {
  
  if (isLoading) {
    return <LoadingSkeleton type="card" count={4} />;
  }

  if (addresses.length === 0) {
    return <EmptyState type="addresses" />;
  }

  // Render default address first, then others
  const sortedAddresses = [...addresses].sort((a, b) => (a.isDefault ? -1 : 1) - (b.isDefault ? -1 : 1));

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full">
      {sortedAddresses.map(address => (
        <AddressCard
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
