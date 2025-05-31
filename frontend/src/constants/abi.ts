// ABI Constants following NERO's high-level documentation

// Basic ERC20 ABI
export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Basic ERC721 ABI
export const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
];

// NERO NFT ABI with mint function (as mentioned in NERO docs)
export const NERO_NFT_ABI = [
  // Basic ERC721 functions from the standard ABI
  ...ERC721_ABI,
  // Add the mint function that exists in the NeroNFT contract
  'function mint(address to, string memory uri) returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string memory)',
];

// Contract addresses mentioned in NERO docs
export const CONTRACT_ADDRESSES = {
  TOKEN_FACTORY_ADDRESS: '0x00ef47f5316A311870fe3F3431aA510C5c2c5a90',
  FREE_NFT_ADDRESS: '0x63f1f7c6a24294a874d7c8ea289e4624f84b48cb',
}; 