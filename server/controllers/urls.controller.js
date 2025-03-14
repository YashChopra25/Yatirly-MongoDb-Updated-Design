import validator from "validator";
import { decodeToken, RandomString } from "../utils/general.js";
import { UAParser } from "ua-parser-js";
import URLmodel from "../models/urls.model.js";
import visitmodel from "../models/visit.models.js";
const createVisit = async (req, prismaUrl) => {
  try {
    const parser = new UAParser(req.headers["user-agent"]);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();
    const visit = await visitmodel.create({
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      urlId: prismaUrl.id,
      browser: browser.name,
      os: os.name,
      device: device.model,
    });
    return visit.toObject();
  } catch (error) {
    console.log("Failed to crate the visit for ", error);
  }
};
class URLControllerClass {
  async create(req, res) {
    try {
      const { longUrl, isQR = false } = req.body;
      if (!longUrl || validator.isEmpty(longUrl)) {
        return res.json({
          success: false,
          message: "All fields are required",
        });
      }
      if (!validator.isURL(longUrl)) {
        return res.json({
          success: false,
          message: "Url is not valid",
        });
      }
      const { token } = req.cookies;
      let data = {
        longURL: longUrl,
        ShortURL: RandomString(),
        isQR,
      };
      console.log(data);
      if (token) {
        const decoded = decodeToken(token);
        data.ownerId = decoded.id;
      }
      const prismaUrl = await URLmodel.create(data);
      if (!prismaUrl) {
        return res.json({
          success: false,
          message: "Url is not created",
          data: prismaUrl,
        });
      }
      return res.json({
        success: true,
        message: "Url is created",
        data: prismaUrl,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
        error,
      });
    }
  }

  async redirect(req, res) {
    try {
      const { shortUrl } = req.params;
      const prismaUrl = await URLmodel.findOne({
        ShortURL: shortUrl,
      });
      if (!prismaUrl) {
        return res.json({
          success: false,
          message: "Url is not found",
        });
      }
      const visit =await createVisit(req, prismaUrl);
      if (visit) {
        prismaUrl.visits.push(visit);
        await prismaUrl.save();
      }

      return res.status(200).json({
        success: true,
        redirectOn: prismaUrl.longURL,
        message: "Url is redirected",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong", error });
    }
  }
}

const URLController = new URLControllerClass();

export default URLController;
