interface POST_TYPE {
  id?: string;
  owner: string;
  type?: "post" | "reel";
  caption?: string;
  items: [
    {
      public_id: string;
      secure_url: string;
      asset_id: string;
      folder: string;
      resource_type: string;
    }
  ];
}

export default POST_TYPE;
