'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

interface Nft {
  id: number;
  recipient: string;
  tokenURI: string;
}

export default function ManageNFTs() {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNft, setNewNft] = useState<{ recipient: string; tokenURI: string }>({ recipient: '', tokenURI: '' });

  const handleCreateNft = () => {
    const newId = nfts.length ? nfts[nfts.length - 1].id + 1 : 1;
    setNfts([...nfts, { id: newId, recipient: newNft.recipient, tokenURI: newNft.tokenURI }]);
    setNewNft({ recipient: '', tokenURI: '' });
    setIsDialogOpen(false);
  };

  const handleDeleteNft = (id: number) => {
    setNfts(nfts.filter(nft => nft.id !== id));
  };

  const handleUpdateNft = (id: number, updatedNft: Partial<Nft>) => {
    setNfts(nfts.map(nft => (nft.id === id ? { ...nft, ...updatedNft } : nft)));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des NFTs Académiques</h1>
      <Button onClick={() => setIsDialogOpen(true)}>Créer NFT</Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Créer un nouveau NFT</DialogTitle>
          <DialogDescription>Remplissez les informations pour créer un NFT.</DialogDescription>
          <Input
            placeholder="Adresse du destinataire"
            value={newNft.recipient}
            onChange={(e) => setNewNft({ ...newNft, recipient: e.target.value })}
            className="mt-2"
          />
          <Input
            placeholder="Token URI"
            value={newNft.tokenURI}
            onChange={(e) => setNewNft({ ...newNft, tokenURI: e.target.value })}
            className="mt-2"
          />
          <Button onClick={handleCreateNft} className="mt-4">Créer</Button>
        </DialogContent>
      </Dialog>

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Destinataire</TableCell>
            <TableCell>Token URI</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nfts.map(nft => (
            <TableRow key={nft.id}>
              <TableCell>{nft.id}</TableCell>
              <TableCell>{nft.recipient}</TableCell>
              <TableCell>{nft.tokenURI}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => handleUpdateNft(nft.id, { recipient: prompt('Nouveau destinataire:', nft.recipient) || nft.recipient })}>
                  Modifier
                </Button>
                <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDeleteNft(nft.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
