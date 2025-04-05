// import { Investor } from './investorEntity';

// export const createInvestor = async (name, funds) => {
//   console.log('Creating investor with name:', name);
//   console.log('Creating investor with funds:', funds);

//   try {
//     // Check what we're working with
//     console.log('Investor type:', typeof Investor);
//     console.log('Mongoose model name:', Investor.modelName);
//     console.log('Is Mongoose model?', Investor.modelName ? true : false);

//     // Create using the document pattern
//     const newInvestor = new Investor({
//       name: name,
//       fund: funds,
//     });

//     // const savedInvestor = await newInvestor.save();

//     return await Investor.create({
//       name: name,
//       fund: funds,
//     });
//     console.log('Investor created:', savedInvestor);
//     return savedInvestor;
//   } catch (error) {
//     console.error('Error creating investor:', error);
//     throw error;
//   }
// };
