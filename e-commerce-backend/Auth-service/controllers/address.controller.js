import { Address } from "../models/address.model.js";
import User from "../models/user.model.js";
export const Addressenter = async(req,res) => {
  const {street ,city, state,zip} = req.body;
  if(!street,!city,!state,!zip){
    return res.status(400).json("inavlid values");

  }

  const address = await Address.create({
    street,city,zip,state,user:req.user._id
  })
if(!address){

    res.status(400).json({error:"Address not created"})
}

return res.status(201).json({address,message:"Address created successfully",success:true});

}

export const AddressDelete = async(req,res) => {
 const addressId = req.params.id;
 const address = await Address.findByIdAndDelete(addressId);

 res.status(200).json({
    message:"address deleted successfully"
 })
}

export const getaddress = async(req,res) => {

    const userId = req.user._id;

    const address = await Address.find({user:userId}).populate("user");
    if(!address){
        return res.status(400).json("inavlid id");
    }

    return res.status(200).json({
        address,
        message:"success",
        success:true

    })

    
}
